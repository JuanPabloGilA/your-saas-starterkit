import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  APP_URL: z.string().url().default('http://localhost:5173'),
  LANDING_URL: z.string().url().default('http://localhost:4321'),
  DASHBOARD_HOST: z.string().default('localhost:5173'),
});

export const env = envSchema.parse(process.env);
