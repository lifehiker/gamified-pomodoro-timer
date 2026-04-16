# Human Input Needed

The app builds and runs without external credentials, but these values are needed to enable production auth and billing safely.

## Required for production deployment

- `AUTH_SECRET`
  Generate a long random secret and set it in your deployment environment.
  Example: `openssl rand -base64 32`

- `NEXT_PUBLIC_APP_URL`
  Set this to the public HTTPS URL of the deployed app.
  Example: `https://pomodoroquest.your-domain.com`

## Required only if you want paid subscriptions enabled

- `STRIPE_SECRET_KEY`
  Your Stripe secret API key from the Stripe dashboard.

- `STRIPE_PRO_PRICE_ID`
  The Stripe Price ID for the `$3/month` subscription plan.

- Webhook endpoint
  In Stripe, create a webhook pointing to:
  `https://your-domain.com/api/webhooks/stripe`

  Subscribe it to the events your billing flow needs, then provide the signing secret as:
  `STRIPE_WEBHOOK_SECRET`

## Platform check outside the repo

- Coolify resource setup
  The deployment log `404 {"message":"No resources found."}` indicates Coolify could not find a target resource to deploy.
  This is a Coolify configuration issue, not a Next.js build issue. Confirm the application resource exists and that the deploy action is targeting the correct resource ID/project.
