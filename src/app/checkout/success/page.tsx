import Stripe from "stripe";
import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { savePurchaseFromCheckoutSession } from "@/lib/supabase/userData";

async function verifyCheckoutSession(sessionId: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return false;

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userId = session.metadata?.user_id ?? session.client_reference_id;
    const isPaid = session.payment_status === "paid";

    if (isPaid && userId) {
      await savePurchaseFromCheckoutSession({
        userId,
        email: session.customer_details?.email ?? session.customer_email,
        sessionId: session.id,
        customerId: typeof session.customer === "string" ? session.customer : null,
        amountTotal: session.amount_total,
        currency: session.currency,
        status: "paid",
      });
    }

    return isPaid;
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
