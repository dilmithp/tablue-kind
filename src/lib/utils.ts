// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { format, parseISO, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number, currency: string = 'LKR'): string {
  if (value >= 1000000) {
    return `${currency} ${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${currency} ${(value / 1000).toFixed(0)}K`;
  }
  return `${currency} ${value.toLocaleString()}`;
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMM dd, yyyy') : dateString;
  } catch {
    return dateString;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'success':
    case 'strong':
    case 'good':
      return 'text-status-success';
    case 'warning':
    case 'monitor':
      return 'text-status-warning';
    case 'danger':
    case 'opportunity':
      return 'text-status-danger';
    default:
      return 'text-tableau-gray-600';
  }
}

export function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return '↗️';
    case 'down':
      return '↘️';
    default:
      return '➡️';
  }
}