# syntax=docker/dockerfile:1
# ── Stage 1: dependencies ────────────────────────────────────────
FROM node:22-alpine AS deps
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── Stage 2: builder ─────────────────────────────────────────────
FROM node:22-alpine AS builder
RUN corepack enable pnpm
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ── Stage 3: runner ──────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV YT_DLP_BIN=/usr/local/bin/yt-dlp
ENV FFMPEG_BIN=/usr/bin/ffmpeg

# Install yt-dlp and ffmpeg
RUN apk add --no-cache python3 ffmpeg curl && \
    curl -fsSL https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
      -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    yt-dlp --version

# Non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /tmp/ytdl && chown nextjs:nodejs /tmp/ytdl

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
