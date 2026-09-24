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

import { SITE_NAME, SITE_NAME_AR, SITE_URL } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const siteName = lang === 'ar' ? SITE_NAME_AR : SITE_NAME;
  
  return {
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description: lang === 'ar' 
      ? 'خدمات تأجير السيارات الرائدة في ماليزيا. استأجر سيارات فخمة، اقتصادية، وعائلية بأفضل الأسعار.' 
      : 'Premium car rental services in Malaysia. Rent luxury, economy, SUV and sports cars at competitive prices.',
    metadataBase: new URL(SITE_URL),
    alternates: {
      languages: {
        'en-US': '/en',
        'ar-SA': '/ar',
      },
    },
    openGraph: {
      title: siteName,
      description: lang === 'ar' ? 'خدمات تأجير السيارات الرائدة في ماليزيا' : 'Premium car rental services in Malaysia',
      url: SITE_URL,
      siteName: siteName,
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
  };
}

export const dynamic = 'force-dynamic';

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
