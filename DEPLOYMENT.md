# Deployment

This project ships as a **single Dockerfile** that builds and serves all three apps (landing, dashboard, API) from one compiled Elysia/Bun binary. At runtime it dispatches on the incoming `Host` header:

- `/api/*` → the Elysia API
- `Host: $DASHBOARD_HOST` → the React dashboard's static files (with SPA fallback)
- anything else → the Astro landing site's static files

That means **one container, one port (3000), two domains pointed at it** — your root domain (landing) and your app subdomain (dashboard + API). Any platform that can run a Dockerfile and let you attach more than one domain to the same service works. Below are steps for Coolify and Dokploy specifically, plus general guidance for anything else.

## Required environment variables

Set these on whatever platform you use — see `packages/config/env.ts` for the full schema:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Long random string |
| `BETTER_AUTH_URL` | Yes | Your dashboard's public origin, e.g. `https://app.yourdomain.com` |
| `OPENAI_API_KEY` | Yes* | See note below |
| `RESEND_API_KEY` | Yes* | See note below |
| `APP_URL` | No (has a dev default) | Dashboard's public origin — set this in production |
| `LANDING_URL` | No (has a dev default) | Landing site's public origin — set this in production |
| `DASHBOARD_HOST` | No (has a dev default) | The `Host` header value that identifies the dashboard domain, e.g. `app.yourdomain.com` — **must match your dashboard domain exactly**, this is what the dispatch logic keys off |

> **Note:** `OPENAI_API_KEY` and `RESEND_API_KEY` are currently hard-required by the env schema even though the AI and email features are optional in practice. If you're not using them yet, set any non-empty placeholder value or the server will refuse to boot.

The container runs pending database migrations automatically on every boot (`drizzle-kit migrate`, before starting the server), so no separate migration step is needed in your deploy pipeline.

## Coolify

1. **New Resource → Application**, connect the Git repository, branch `main`.
2. Build pack: **Dockerfile** (it'll auto-detect the root `Dockerfile`).
3. **Ports**: expose `3000`.
4. **Domains**: Coolify accepts multiple comma-separated domains on one application, all routed to the same container — set both here, e.g.:
   ```
   https://yourdomain.com,https://app.yourdomain.com:3000
   ```
   (Coolify infers port 3000 from the app's exposed port if you don't append it per-domain.)
5. **Environment Variables**: add the table above. Set `DASHBOARD_HOST=app.yourdomain.com` (bare host, no scheme) to match your dashboard domain.
6. **Health Check**: Coolify uses the container's `HEALTHCHECK` by default (already defined in the Dockerfile as `GET /api/health`) — no extra config needed, but you can point Coolify's own health check at `/api/health` on port 3000 if you want it enforced at the proxy level too.
7. Deploy. Coolify/Traefik handles TLS via Let's Encrypt for both domains automatically.

## Dokploy

1. **Create Project → Application**, connect the Git repository, branch `main`.
2. **Build Type**: **Dockerfile**.
3. Go to the **Domains** tab and add two separate domain entries, both pointing at **Container Port `3000`**:
   - Host: `yourdomain.com` (landing)
   - Host: `app.yourdomain.com` (dashboard + API)
   - Enable **HTTPS** with Let's Encrypt on both.
4. **Environment Variables** tab: add the table above, with `DASHBOARD_HOST=app.yourdomain.com`.
5. Deploy. Dokploy/Traefik provisions certificates for each domain independently; domain changes apply without a redeploy.

## Any other Docker host (Railway, Render, Fly.io, CapRover, a plain VPS + Traefik/Caddy, etc.)

The same three things always apply, regardless of platform:

1. **Build from the root `Dockerfile`**, expose port `3000`.
2. **Point both your root domain and your app subdomain at the same deployed container**, however that platform expresses "multiple domains → one service" (some platforms want this per-service, others need a reverse proxy in front of a single-domain service — check whether the platform supports multiple domains natively before reaching for your own Traefik/Caddy in front of it).
3. **Set `DASHBOARD_HOST` to your app subdomain's bare hostname** (no `https://`) — this is the only thing that tells the binary which incoming requests are the dashboard vs. the landing site.

If a platform genuinely can't attach two domains to one service, the fallback is running your own reverse proxy (Traefik/Caddy/nginx) in front of the single container, routing both domains to the same upstream port — `DASHBOARD_HOST` still does the actual dispatch on the app side either way.
