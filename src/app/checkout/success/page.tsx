import Stripe from "stripe";
import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";

async function verifyCheckoutSession(sessionId: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return false;

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid";
  } catch (error) {
    console.error("Failed to verify Stripe Checkout Session", error);
    return false;
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const isPaid = sessionId ? await verifyCheckoutSession(sessionId) : false;

  return (
    <MobileShell>
      <AppHeader showBack backHref="/checkout/confirm" title="購入完了" />
      <CheckoutSuccessClient isPaid={isPaid} />
    </MobileShell>
  );
}
