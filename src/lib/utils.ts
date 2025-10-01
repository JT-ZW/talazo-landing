import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for Zimbabwe numbers
  if (cleaned.startsWith('263')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+263${cleaned.slice(1)}`;
  } else {
    return `+263${cleaned}`;
  }
}

export function validateZimbabwePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Zimbabwe mobile numbers: +263 7X XXXXXXX or +263 77 XXXXXXX
  return /^(263)?(7[1-9])\d{6}$/.test(cleaned);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-ZW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}