import { env } from '@your-saas-starterkit/config';
import { drizzle } from 'drizzle-orm/bun-sql';

export const db = drizzle(env.DATABASE_URL);
