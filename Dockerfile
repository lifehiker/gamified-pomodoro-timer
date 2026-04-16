FROM node:20-slim AS deps
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

FROM node:20-slim AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV AUTH_SECRET="build-time-placeholder-secret"
ENV NEXT_PUBLIC_APP_URL="https://localhost:3000"

# Re-enable package postinstall hooks now that the full source tree is present.
RUN npm rebuild 2>/dev/null || true
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV AUTH_SECRET="forge-app-default-secret-override-in-production"
ENV AUTH_TRUST_HOST="true"
ENV NEXT_PUBLIC_APP_URL=""

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && mkdir -p /app/.data \
  && chown -R nextjs:nodejs /app

# No public/ directory exists in this repo, so only copy the standalone server output.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
