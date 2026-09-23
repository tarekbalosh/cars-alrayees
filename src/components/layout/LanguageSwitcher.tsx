'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname();
  const targetLang = currentLang === 'ar' ? 'en' : 'ar';
  const label = currentLang === 'ar' ? 'English' : 'العربية';

  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <Button variant="ghost" asChild className="font-semibold px-2 py-1 h-auto text-sm">
      <Link href={redirectedPathName(targetLang)}>{label}</Link>
    </Button>
  );
}
