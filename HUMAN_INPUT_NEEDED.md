# Human Input Needed

## Stripe Configuration for Pro Plan

The app has Stripe payment integration for the Pro plan ($3/month). The app works fully without Stripe credentials (all free features work), but to enable Pro plan upgrades, the following environment variables must be configured in Coolify:

- `STRIPE_SECRET_KEY` - Stripe secret key (get from Stripe dashboard -> Developers -> API keys)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (same location)
- `STRIPE_PRO_PRICE_ID` - The price ID for the $3/month subscription (create a product in Stripe dashboard -> Products, set to $3/month recurring, copy the price ID starting with `price_`)
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret (Stripe dashboard -> Developers -> Webhooks, add endpoint at https://yourdomain.com/api/webhooks/stripe, copy the signing secret starting with whsec_)

The app runs perfectly fine with zero env vars configured - only the Upgrade to Pro button will fail silently if Stripe is not configured.
