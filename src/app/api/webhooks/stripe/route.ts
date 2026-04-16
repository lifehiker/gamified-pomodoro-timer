import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { updateSubscriptionByStripeId, upsertSubscription } from "@/lib/data-store";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const userId = checkoutSession.metadata?.userId;
      if (userId && checkoutSession.subscription) {
        const subscription = await stripe.subscriptions.retrieve(checkoutSession.subscription as string);
        await upsertSubscription({
          userId,
          stripeCustomerId: checkoutSession.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id ?? null,
          stripeCurrentPeriodEnd: subscription.items.data[0]
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null,
          status: "active",
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await updateSubscriptionByStripeId(subscription.id, {
        status: subscription.status === "active" ? "active" : "inactive",
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
