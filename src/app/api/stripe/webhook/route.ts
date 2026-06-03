import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  savePlusSubscriptionFromCheckoutSession,
  savePlusSubscriptionFromStripeSubscription,
  savePurchaseFromCheckoutSession,
} from "@/lib/supabase/userData";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe Webhookの設定が完了していません。" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Stripe署名がありません。" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Invalid Stripe webhook signature", error);
    return NextResponse.json({ error: "Webhook署名を確認できませんでした。" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.mode === "subscription" && session.metadata?.product === "kimochi_note_plus_monthly") {
      try {
        await savePlusSubscriptionFromCheckoutSession(session);
      } catch (error) {
        console.error("Failed to save Plus subscription from checkout", error);
        return NextResponse.json({ error: "Plus購入情報の保存に失敗しました。" }, { status: 500 });
      }

      return NextResponse.json({ received: true });
    }

    const userId = session.metadata?.user_id;

    if (!userId) {
      if (session.metadata?.dev_checkout === "true") {
        return NextResponse.json({ received: true, devCheckout: true });
      }

      return NextResponse.json({ error: "Checkout Sessionにuser_idがありません。" }, { status: 400 });
    }

    try {
      await savePurchaseFromCheckoutSession({
        userId,
        email: session.customer_details?.email ?? session.customer_email,
        sessionId: session.id,
        customerId: typeof session.customer === "string" ? session.customer : null,
        amountTotal: session.amount_total,
        currency: session.currency,
        status: session.payment_status === "paid" ? "paid" : "unpaid",
      });
    } catch (error) {
      console.error("Failed to save purchase from webhook", error);
      return NextResponse.json({ error: "購入情報の保存に失敗しました。" }, { status: 500 });
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    try {
      await savePlusSubscriptionFromStripeSubscription(event.data.object);
    } catch (error) {
      console.error("Failed to save Plus subscription event", error);
      return NextResponse.json({ error: "Plusサブスク情報の保存に失敗しました。" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
