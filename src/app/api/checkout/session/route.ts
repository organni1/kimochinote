import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/userData";

function getAppUrl(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configuredUrl) return configuredUrl;
  return request.nextUrl.origin;
}

function isDevCheckoutEnabled() {
  return process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_DEV_CHECKOUT === "true";
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripeの設定がまだ完了していません。STRIPE_SECRET_KEYを設定してください。" },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    devCheckout?: boolean;
    email?: string;
  };
  const useDevCheckout = body.devCheckout === true && isDevCheckoutEnabled();
  const { user, error } = useDevCheckout ? { user: null, error: null } : await getAuthenticatedUser(request);

  if (!user && !useDevCheckout) {
    return NextResponse.json(
      { error: error ?? "購入前にメール認証を完了してください。" },
      { status: 401 }
    );
  }

  if (user) {
    try {
      await ensureProfile(user);
    } catch (profileError) {
      console.error("Failed to ensure profile before checkout", profileError);
      return NextResponse.json(
        { error: "購入情報を保存する準備に失敗しました。Supabaseの設定を確認してください。" },
        { status: 500 }
      );
    }
  } else if (body.devCheckout === true && !useDevCheckout) {
    return NextResponse.json(
      { error: "開発用Checkoutはローカル開発環境でのみ利用できます。" },
      { status: 403 }
    );
  }

  const stripe = new Stripe(secretKey);
  const appUrl = getAppUrl(request);
  const customerEmail = user?.email ?? (body.email?.trim() || undefined);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      client_reference_id: user?.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "jpy",
            unit_amount: 480,
            product_data: {
              name: "あなたの悩みに合わせた7日間アクションプラン",
              description: "きもちノートの買い切り7日間アクションプラン",
            },
          },
        },
      ],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/confirm`,
      metadata: {
        product: "kimochi_note_7day_plan",
        ...(user ? { user_id: user.id } : { dev_checkout: "true" }),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (checkoutError) {
    console.error("Failed to create Stripe Checkout Session", checkoutError);
    return NextResponse.json(
      { error: "Stripe Checkoutの開始に失敗しました。時間をおいてもう一度お試しください。" },
      { status: 500 }
    );
  }
}
