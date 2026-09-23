import Link from 'next/link';
import type { Locale, Dictionary } from '@/i18n';
import { SITE_NAME, SITE_NAME_AR } from '@/lib/constants';

interface FooterProps {
  lang: Locale;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  const siteName = lang === 'ar' ? SITE_NAME_AR : SITE_NAME;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href={`/${lang}`} className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tight text-primary">
                {siteName}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {dict.footer.description}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">{dict.footer.quickLinks}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href={`/${lang}`} className="hover:text-primary transition-colors">{dict.nav.home}</Link></li>
              <li><Link href={`/${lang}/cars`} className="hover:text-primary transition-colors">{dict.nav.cars}</Link></li>
              <li><Link href={`/${lang}/services`} className="hover:text-primary transition-colors">{dict.nav.services}</Link></li>
              <li><Link href={`/${lang}/about`} className="hover:text-primary transition-colors">{dict.nav.about}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">{dict.footer.contactInfo}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>{dict.contact.phone}: +60 12-345 6789</li>
              <li>{dict.contact.email}: info@alrayees.com</li>
              <li>Kuala Lumpur, Malaysia</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {year} {siteName}. {dict.footer.rights}.</p>
        </div>
      </div>
    </footer>
  );
}
