import { env } from '@your-saas-starterkit/config';
import { Resend } from 'resend';

export const resend = new Resend(env.RESEND_API_KEY);
