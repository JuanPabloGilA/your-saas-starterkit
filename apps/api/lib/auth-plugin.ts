import { Elysia } from 'elysia';
import { auth } from './auth';

export const betterAuthPlugin = new Elysia({ name: 'better-auth' }).mount(auth.handler);
