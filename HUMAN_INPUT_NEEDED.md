# Human Input Needed

The following credentials and external accounts must be configured before the app can run in production.

## 1. PostgreSQL Database
- Set up a PostgreSQL database
- Set `DATABASE_URL` in `.env.local`
- Run: `npx prisma db push` to create the schema

## 2. Google OAuth (NextAuth)
- Go to https://console.developers.google.com
- Create a new project
- Enable Google OAuth 2.0
- Create credentials: OAuth 2.0 Client ID (Web application)
- Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`
- Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in `.env.local`
- Generate `AUTH_SECRET`: run `openssl rand -base64 32`

## 3. Stripe (Payments)
- Create account at https://stripe.com
- Get API keys from Dashboard > Developers > API keys
- Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Create a recurring price product: $3/month
- Set `STRIPE_PRO_PRICE_ID` to the price ID (e.g., price_xxx)
- Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
  - Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
- Set `STRIPE_WEBHOOK_SECRET` to the webhook signing secret

## 4. Resend (Email — Optional)
- Create account at https://resend.com
- Get API key from Dashboard
- Set `RESEND_API_KEY` and `EMAIL_FROM`
- Note: Email features are not yet fully implemented in v1

## 5. App URL
- Set `NEXT_PUBLIC_APP_URL` to your production URL
