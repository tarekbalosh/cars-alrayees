import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n';
import { Hero } from '@/components/features/home/Hero';
import { CarCard } from '@/components/shared/CarCard';
import { CarService } from '@/core/services';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  
  // Fetch featured cars
  const featuredCars = await CarService.getFeaturedCars();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero dict={dict} lang={lang as Locale} />
      
      {/* Featured Cars Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-3">{dict.cars.featured}</h2>
              <p className="text-muted-foreground">{dict.cars.subtitle}</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex font-medium">
              <Link href={`/${lang}/cars`}>
                {dict.cars.viewAll}
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCars.slice(0, 4).map((car) => (
              <CarCard key={car.id} car={car} dict={dict} lang={lang as Locale} />
            ))}
          </div>
          
          <div className="mt-10 flex justify-center sm:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href={`/${lang}/cars`}>
                {dict.cars.viewAll}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16">{dict.whyUs.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/50">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="font-semibold text-lg mb-3">{dict.whyUs.quality}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{dict.whyUs.qualityDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/50">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-lg mb-3">{dict.whyUs.prices}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{dict.whyUs.pricesDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/50">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎧</span>
              </div>
              <h3 className="font-semibold text-lg mb-3">{dict.whyUs.support}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{dict.whyUs.supportDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/50">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold text-lg mb-3">{dict.whyUs.flexible}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{dict.whyUs.flexibleDesc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
