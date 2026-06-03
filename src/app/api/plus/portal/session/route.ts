import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

function getAppUrl(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configuredUrl) return configuredUrl;
  return request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "サブスク管理の設定がまだ完了していません。" },
      { status: 500 }
    );
  }

  const { user, error } = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { error: error ?? "ログインが必要です。" },
      { status: 401 }
    );
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "保存設定が完了していません。" },
      { status: 500 }
    );
  }

  const { data } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .eq("plan_type", "plus_monthly")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.stripe_customer_id) {
    return NextResponse.json(
      { error: "サブスク管理に必要な購入情報が見つかりませんでした。" },
      { status: 404 }
    );
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${getAppUrl(request)}/mypage`,
    });

    return NextResponse.json({ url: session.url });
  } catch (portalError) {
    console.error("Failed to create Plus portal session", portalError);
    return NextResponse.json(
      { error: "サブスク管理ページを開けませんでした。" },
      { status: 500 }
    );
  }
}
