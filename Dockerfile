# syntax=docker/dockerfile:1
#
# Single-container build for your-saas-starterkit: serves the Astro
# landing site at domain.com, the Vite dashboard SPA + Elysia API at
# app.domain.com, all from one compiled Elysia binary that dispatches
# on the Host header (see apps/api/index.ts). Replaces nixpacks.toml:
# nixpacks lags official Bun releases, so this uses Bun's own image,
# which publishes same-day as each release.
FROM oven/bun:1.4
WORKDIR /app

# git is needed only to read the short commit SHA at build time if a
# release tag is ever baked into the bundle; curl is needed for the
# container HEALTHCHECK below (GET /api/health).
RUN apt-get update && apt-get install -y --no-install-recommends git curl \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies first (better layer caching) — copy every
# workspace's package.json before `bun install` so the lockfile resolves
# correctly across the monorepo.
COPY package.json bun.lock ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY apps/landing/package.json apps/landing/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/config/package.json packages/config/package.json
RUN bun install

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

RUN bun run build --filter=@your-saas-starterkit/web && \
    bun run build --filter=@your-saas-starterkit/landing && \
    mkdir -p /app/_static/dashboard /app/_static/landing && \
    cp -r apps/web/dist/* /app/_static/dashboard/ && \
    cp -r apps/landing/dist/* /app/_static/landing/ && \
    cd apps/api && bun build index.ts --compile --minify --sourcemap --outfile=prod-server && \
    mv prod-server /app/prod-server && \
    chmod +x /app/prod-server

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Apply pending DB migrations before booting, so the schema always matches
# the code being deployed. drizzle-kit migrate is idempotent (tracks
# applied migrations), so re-running on every boot is safe; if a migration
# fails the server won't start (fail loud).
CMD ["sh", "-c", "cd /app/packages/database && bun run db:migrate && /app/prod-server"]
