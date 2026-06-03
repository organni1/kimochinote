import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { ensureProfile, readSevenDayContext } from "@/lib/supabase/userData";

function getAppUrl(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configuredUrl) return configuredUrl;
  return request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID_PLUS_MONTHLY;

  if (!secretKey || !priceId) {
    return NextResponse.json(
      { error: "Kimochi Note Plusの決済設定がまだ完了していません。" },
      { status: 500 }
    );
  }

  const { user, error } = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { error: error ?? "Plusをはじめるにはログインが必要です。" },
      { status: 401 }
    );
  }

  if (!user.email) {
    return NextResponse.json(
      { error: "メールアドレスを確認できませんでした。別のログイン方法をお試しください。" },
      { status: 400 }
    );
  }

  try {
    await ensureProfile(user);
    const sevenDayContext = await readSevenDayContext(user);
    const stripe = new Stripe(secretKey);
    const appUrl = getAppUrl(request);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/plus?checkout=success`,
      cancel_url: `${appUrl}/plus?checkout=cancel`,
      subscription_data: {
        metadata: {
          product: "kimochi_note_plus_monthly",
          user_id: user.id,
          user_email: user.email,
          source: sevenDayContext.source,
          plus_start_day: String(sevenDayContext.plusStartDay),
          ...(sevenDayContext.purchaseId ? { linked_7day_purchase_id: sevenDayContext.purchaseId } : {}),
        },
      },
      metadata: {
        product: "kimochi_note_plus_monthly",
        user_id: user.id,
        user_email: user.email,
        source: sevenDayContext.source,
        plus_start_day: String(sevenDayContext.plusStartDay),
        ...(sevenDayContext.purchaseId ? { linked_7day_purchase_id: sevenDayContext.purchaseId } : {}),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (checkoutError) {
    console.error("Failed to create Plus Checkout Session", checkoutError);
    return NextResponse.json(
      { error: "Kimochi Note Plusの購入手続きを開始できませんでした。" },
      { status: 500 }
    );
  }
}
