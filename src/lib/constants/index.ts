export const SITE_NAME = 'Al Rayees Car Rental';
export const SITE_NAME_AR = 'تأجير سيارات الرئيس';
export const DEFAULT_CURRENCY = 'MYR';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const TRANSMISSION_LABELS = {
  ar: { AUTOMATIC: 'أوتوماتيك', MANUAL: 'يدوي' },
  en: { AUTOMATIC: 'Automatic', MANUAL: 'Manual' },
} as const;

export const FUEL_TYPE_LABELS = {
  ar: { PETROL: 'بنزين', DIESEL: 'ديزل', HYBRID: 'هايبرد', ELECTRIC: 'كهربائي' },
  en: { PETROL: 'Petrol', DIESEL: 'Diesel', HYBRID: 'Hybrid', ELECTRIC: 'Electric' },
} as const;

export const RENTAL_PERIOD_LABELS = {
  ar: { DAILY: 'يومي', WEEKLY: 'أسبوعي', MONTHLY: 'شهري' },
  en: { DAILY: 'Daily', WEEKLY: 'Weekly', MONTHLY: 'Monthly' },
} as const;
