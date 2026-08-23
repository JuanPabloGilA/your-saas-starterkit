import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const appUrl = import.meta.env.PUBLIC_APP_URL || 'http://localhost:5173';

export function appLink(path: string) {
  return `${appUrl}${path}`;
}
