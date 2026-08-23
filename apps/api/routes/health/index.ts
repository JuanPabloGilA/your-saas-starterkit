import { Elysia } from 'elysia';

export const healthRoutes = new Elysia().get('/', () => ({ message: 'API is healthy' }));
