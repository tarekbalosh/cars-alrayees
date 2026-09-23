import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n';
import { CarService } from '@/core/services';
import { CarGallery } from '@/components/features/cars/CarGallery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Fuel, Settings, Check, Phone } from 'lucide-react';
import { TRANSMISSION_LABELS, FUEL_TYPE_LABELS } from '@/lib/constants';

interface CarDetailsPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang as Locale);
  
  const car = await CarService.getCarBySlug(slug);
  
  if (!car) {
    notFound();
  }

  const transmissionLabel = TRANSMISSION_LABELS[lang as Locale][car.transmission];
  const fuelTypeLabel = FUEL_TYPE_LABELS[lang as Locale][car.fuelType];
  const description = lang === 'ar' ? car.descriptionAr : car.descriptionEn;

  // Format WhatsApp message
  const whatsappNumber = "60123456789"; // Configuration
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in renting the ${car.brand} ${car.model}.`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <CarGallery images={car.images || []} brand={car.brand} lang={lang as Locale} />
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                {lang === 'ar' ? car.category?.nameAr : car.category?.nameEn}
              </Badge>
              {!car.isAvailable && (
                <Badge variant="destructive" className="px-3 py-1 text-sm font-medium">
                  {dict.cars.unavailable}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              {car.brand} {car.model}
            </h1>
            <p className="text-xl text-muted-foreground">{car.year}</p>
          </div>

          <div className="prose prose-muted max-w-none">
            <p>{description}</p>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-border">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <Users className="w-6 h-6 mb-2 text-primary/70" />
              <span className="text-sm font-medium">{car.seats} {dict.carDetails.seats}</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <Briefcase className="w-6 h-6 mb-2 text-primary/70" />
              <span className="text-sm font-medium">{car.luggageCapacity} {dict.carDetails.luggage}</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <Settings className="w-6 h-6 mb-2 text-primary/70" />
              <span className="text-sm font-medium">{transmissionLabel}</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <Fuel className="w-6 h-6 mb-2 text-primary/70" />
              <span className="text-sm font-medium">{fuelTypeLabel}</span>
            </div>
          </div>

          {/* Features */}
          {car.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{dict.carDetails.features}</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {car.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-muted-foreground">
                    <Check className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing & CTA */}
          <div className="bg-muted/30 p-8 rounded-2xl border border-border/50 space-y-6">
            {car.pricing ? (
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-4xl font-bold text-primary">{car.pricing.dailyRate}</span>
                  <span className="text-muted-foreground font-medium ml-2">
                    {dict.common.currency} / {dict.cars.perDay}
                  </span>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{dict.carDetails.securityDeposit}: {car.pricing.securityDeposit} {dict.common.currency}</p>
                </div>
              </div>
            ) : (
              <div className="text-xl font-semibold">{dict.carDetails.inquireWhatsApp}</div>
            )}
            
            <Button size="lg" asChild className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Phone className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                {dict.carDetails.bookNow}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
