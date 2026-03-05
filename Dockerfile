FROM node:22.21.1-alpine@sha256:b2358485e3e33bc3a33114d2b1bdb18cdbe4df01bd2b257198eb51beb1f026c5 AS dwpbase

FROM dwpbase AS deps

# Needed for building within the DWP engineering environment
ARG NPM_REGISTRY_URL=https://registry.npmjs.org/
RUN npm config set -g registry ${NPM_REGISTRY_URL} \
    && npm config set -g strict-ssl false \
    && apk update && apk add --no-cache ca-certificates=20250911-r0 libc6-compat=1.1.0-r4 \ 
    && update-ca-certificates 

WORKDIR /app


COPY package.json package-lock.json* .npmrc ./
RUN npm ci --omit=dev --ignore-scripts --verbose
RUN npm install --save-exact --save-dev typescript@5.9.3 @types/node@24.5.2

# Rebuild the source code only when needed
FROM dwpbase AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM dwpbase AS runner
WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache openssl=3.5.4-r0 busybox=1.37.0-r19 \
    && echo "NPM Version" && npm -v

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \ 
    CMD ["wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/"]

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]