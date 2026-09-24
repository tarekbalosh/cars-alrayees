import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n';
import { CarService } from '@/core/services';
import { CarGallery } from '@/components/features/cars/CarGallery';
import { CarBookingWidget } from '@/components/features/cars/CarBookingWidget';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Fuel, Settings, Check, Phone } from 'lucide-react';
import { TRANSMISSION_LABELS, FUEL_TYPE_LABELS } from '@/lib/constants';

interface CarDetailsPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: CarDetailsPageProps) {
  const { lang, slug } = await params;
  const car = await CarService.getCarBySlug(slug);
  
  if (!car) {
    return { title: 'Not Found' };
  }

  const title = `${car.brand} ${car.model} ${car.year}`;
  const description = lang === 'ar' ? car.descriptionAr : car.descriptionEn;
  const imageUrl = car.images?.find((img) => img.isPrimary)?.url || car.images?.[0]?.url;

  return {
    title,
    description: description.substring(0, 160),
    openGraph: {
      title,
      description: description.substring(0, 160),
      images: imageUrl ? [{ url: imageUrl }] : [],
    }
  };
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

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "60123456789"; // Configuration
  
  const t = {
    currency: dict.common.currency,
    perDay: dict.cars.perDay,
    securityDeposit: dict.carDetails.securityDeposit,
    inquireWhatsApp: dict.carDetails.inquireWhatsApp,
    bookNow: dict.carDetails.bookNow,
    rentalDuration: lang === 'ar' ? 'مدة الإيجار (أيام)' : 'Rental Duration (Days)',
    totalPrice: lang === 'ar' ? 'السعر الإجمالي' : 'Total Price'
  };


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

          <CarBookingWidget
            pricing={car.pricing}
            carBrand={car.brand}
            carModel={car.model}
            carSlug={slug}
            whatsappNumber={whatsappNumber}
            t={t}
            lang={lang}
            isAvailable={car.isAvailable}
          />
        </div>
      </div>
    </div>
  );
}
