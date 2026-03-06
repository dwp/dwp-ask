FROM node:22.22.0-alpine@sha256:e4bf2a82ad0a4037d28035ae71529873c069b13eb0455466ae0bc13363826e34 AS dwpbase

FROM dwpbase AS deps

# Needed for building within the DWP engineering environment
ARG NPM_REGISTRY_URL=https://registry.npmjs.orgjs-proxy/

RUN npm cache clean --force
RUN npm config set -g registry ${NPM_REGISTRY_URL} \
    && apk update && apk add --no-cache ca-certificates=20251003-r0 libc6-compat=1.1.0-r4 \
    && update-ca-certificates

WORKDIR /app

COPY package.json package-lock.json* .npmrc ./

ENV HUSKY=0
RUN npm ci --verbose

# Rebuild the source code only when needed
FROM dwpbase AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM dwpbase AS runner
WORKDIR /app

RUN apk update && apk add --no-cache --repository=https://<redacted>/repository/alpine/v3.23/main \
    openssl=3.5.5-r0 busybox=1.37.0-r30 \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && mkdir -p .next

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
    CMD ["wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/"]

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]