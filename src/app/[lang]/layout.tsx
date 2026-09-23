import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Al Rayees Car Rental',
    default: 'Al Rayees Car Rental | تأجير سيارات الرئيس',
  },
  description: 'Premium car rental services in Malaysia. Rent luxury, economy, SUV and sports cars at competitive prices.',
};

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getDictionary } from '@/i18n';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Header lang={locale} dict={dict} />
        <main className="flex-1">
          {children}
        </main>
        <Footer lang={locale} dict={dict} />
      </body>
    </html>
  );
}
