# Human Input Needed

## Optional: Stripe Payments

To enable subscription payment features:
1. Create account at https://stripe.com
2. Get API keys from Dashboard > Developers > API keys
3. Set these environment variables in your deployment:
   - STRIPE_SECRET_KEY
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - STRIPE_WEBHOOK_SECRET
   - STRIPE_PRO_PRICE_ID

The app works fully without Stripe - payment processing is simply disabled.

## Optional: Override AUTH_SECRET

For production security, generate a unique secret:
  openssl rand -base64 32

Set as AUTH_SECRET environment variable. A default is baked into the Dockerfile for zero-config deployment.
