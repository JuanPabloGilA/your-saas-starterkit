import { treaty } from '@elysiajs/eden';
import type { App } from '@your-saas-starterkit/api/app';

const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;

export const api = treaty<App>(baseUrl).api;
