# Human Input Needed

This app requires credentials before full deployment.

## Required Variables

- DATABASE_URL - PostgreSQL connection string
- AUTH_SECRET - generate with openssl rand -base64 32
- AUTH_GOOGLE_ID + AUTH_GOOGLE_SECRET - Google OAuth credentials
- STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRO_PRICE_ID - Stripe keys
- RESEND_API_KEY + EMAIL_FROM - Resend email service
- NEXT_PUBLIC_APP_URL - your deployed domain

## Note

The core timer, gamification, and analytics features work entirely in the browser using localStorage -- no database required. Credentials only needed for: user accounts/cloud sync, subscriptions (Stripe), and email notifications (Resend).
