import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Dictionary, Locale } from '@/i18n';

interface HeroProps {
  dict: Dictionary;
  lang: Locale;
}

export function Hero({ dict, lang }: HeroProps) {
  const isRtl = lang === 'ar';
  const Icon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative w-full overflow-hidden bg-background pt-24 pb-32">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl text-foreground">
          {dict.hero.title}
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
          {dict.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild className="font-semibold text-lg px-8 h-14">
            <Link href={`/${lang}/cars`}>
              {dict.hero.cta}
              <Icon className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="font-semibold text-lg px-8 h-14">
            <Link href={`/${lang}/contact`}>
              {dict.hero.ctaSecondary}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
