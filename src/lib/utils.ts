import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  // Normalize YYYYMM → YYYY-MM
  let normalized = dateStr;
  if (/^\d{6}$/.test(dateStr)) normalized = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}`;
  const parts = normalized.split('-');
  const year = parts[0];
  const month = parts[1];
  if (!year || !month) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const idx = parseInt(month, 10) - 1;
  if (idx < 0 || idx > 11) return year;
  return `${months[idx]} ${year}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
