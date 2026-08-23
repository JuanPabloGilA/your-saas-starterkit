import { env } from '@your-saas-starterkit/config';
import { app } from './app';

const LANDING_ROOT = '/app/_static/landing';
const DASHBOARD_ROOT = '/app/_static/dashboard';
const port = Number(process.env.PORT ?? 3000);

Bun.serve({
  port,
  hostname: '0.0.0.0',
  fetch: async (request) => {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api')) return app.fetch(request);

    const isDashboardHost = request.headers.get('host') === env.DASHBOARD_HOST;
    const root = isDashboardHost ? DASHBOARD_ROOT : LANDING_ROOT;
    const filePath = `${root}${url.pathname === '/' ? '/index.html' : url.pathname}`;
    const file = Bun.file(filePath);
    if (await file.exists()) return new Response(file);
    if (isDashboardHost) return new Response(Bun.file(`${DASHBOARD_ROOT}/index.html`));
    return new Response('Not found', { status: 404 });
  },
});

console.log(`Server running at http://0.0.0.0:${port}/`);
