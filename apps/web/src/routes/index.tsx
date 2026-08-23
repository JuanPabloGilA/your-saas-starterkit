import { createFileRoute, redirect } from '@tanstack/react-router';
import { getSession } from '@/lib/auth-client';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSession();
    throw redirect({
      to: session.data ? '/dashboard' : '/login',
    });
  },
});
