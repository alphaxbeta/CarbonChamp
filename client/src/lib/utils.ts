import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function getWeekDays(locale: string = 'en-US'): string[] {
  const baseDate = new Date();
  const weekDays = [];
  
  // Set to previous Sunday
  baseDate.setDate(baseDate.getDate() - baseDate.getDay());
  
  // Get the next 7 days
  for (let i = 0; i < 7; i++) {
    weekDays.push(baseDate.toLocaleDateString(locale, { weekday: 'short' }));
    baseDate.setDate(baseDate.getDate() + 1);
  }
  
  return weekDays;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function getDaysLeft(endDate: string | Date): number {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  
  // Set hours to 0 to just compare days
  end.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
}

export function getRandomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getWeatherIcon(code: string): string {
  const iconMap: Record<string, string> = {
    '01d': 'ri-sun-line',
    '01n': 'ri-moon-clear-line',
    '02d': 'ri-sun-cloudy-line',
    '02n': 'ri-moon-cloudy-line',
    '03d': 'ri-cloud-line',
    '03n': 'ri-cloud-line',
    '04d': 'ri-cloudy-line',
    '04n': 'ri-cloudy-line',
    '09d': 'ri-drizzle-line',
    '09n': 'ri-drizzle-line',
    '10d': 'ri-rainy-line',
    '10n': 'ri-rainy-line',
    '11d': 'ri-thunderstorms-line',
    '11n': 'ri-thunderstorms-line',
    '13d': 'ri-snowy-line',
    '13n': 'ri-snowy-line',
    '50d': 'ri-mist-line',
    '50n': 'ri-mist-line',
  };
  
  return iconMap[code] || 'ri-sun-line';
}
