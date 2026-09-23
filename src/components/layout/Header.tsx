import Link from 'next/link';
import type { Locale, Dictionary } from '@/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SITE_NAME, SITE_NAME_AR } from '@/lib/constants';

interface HeaderProps {
  lang: Locale;
  dict: Dictionary;
}

export function Header({ lang, dict }: HeaderProps) {
  const siteName = lang === 'ar' ? SITE_NAME_AR : SITE_NAME;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={`/${lang}`} className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-2xl font-bold tracking-tight text-primary">
            {siteName}
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium rtl:space-x-reverse">
          <Link href={`/${lang}`} className="transition-colors hover:text-foreground/80 text-foreground/60">{dict.nav.home}</Link>
          <Link href={`/${lang}/cars`} className="transition-colors hover:text-foreground/80 text-foreground/60">{dict.nav.cars}</Link>
          <Link href={`/${lang}/services`} className="transition-colors hover:text-foreground/80 text-foreground/60">{dict.nav.services}</Link>
          <Link href={`/${lang}/about`} className="transition-colors hover:text-foreground/80 text-foreground/60">{dict.nav.about}</Link>
          <Link href={`/${lang}/contact`} className="transition-colors hover:text-foreground/80 text-foreground/60">{dict.nav.contact}</Link>
        </nav>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
}
