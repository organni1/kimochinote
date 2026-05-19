import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getAppUrl(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configuredUrl) return configuredUrl;
  return request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripeの設定がまだ完了していません。STRIPE_SECRET_KEYを設定してください。" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);
  const appUrl = getAppUrl(request);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
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
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create Stripe Checkout Session", error);
    return NextResponse.json(
      { error: "Stripe Checkoutの開始に失敗しました。時間をおいてもう一度お試しください。" },
      { status: 500 }
    );
  }
}
