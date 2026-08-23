import { cors } from '@elysiajs/cors';
import { env } from '@your-saas-starterkit/config';
import { Elysia } from 'elysia';
import { betterAuthPlugin } from './lib/auth-plugin';
import { aiRoutes } from './routes/ai';
import { healthRoutes } from './routes/health';

const trustedOrigins = Array.from(
  new Set([env.APP_URL, env.LANDING_URL, 'http://localhost:5173', 'http://localhost:4321'])
);

export const app = new Elysia()
  .onRequest(({ request }) => {
    console.log(request.method, new URL(request.url).pathname);
  })
  .use(cors({ origin: trustedOrigins, credentials: true }))
  .group('/api', (app) =>
    app
      .group('/health', (app) => app.use(healthRoutes))
      .group('/ai', (app) => app.use(aiRoutes))
      .group('/auth', (app) => app.use(betterAuthPlugin))
  );

export type App = typeof app;
