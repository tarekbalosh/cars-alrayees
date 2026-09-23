import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Fuel, Settings } from 'lucide-react';
import type { CarWithDetails } from '@/core/domain';
import type { Dictionary, Locale } from '@/i18n';
import { TRANSMISSION_LABELS, FUEL_TYPE_LABELS } from '@/lib/constants';

interface CarCardProps {
  car: CarWithDetails;
  dict: Dictionary;
  lang: Locale;
}

export function CarCard({ car, dict, lang }: CarCardProps) {
  const primaryImage = car.images?.find((img) => img.isPrimary) || car.images?.[0];
  const imageUrl = primaryImage?.url || '/placeholder-car.jpg';
  const imageAlt = lang === 'ar' ? (primaryImage?.altAr || car.brand) : (primaryImage?.altEn || car.brand);
  const transmissionLabel = TRANSMISSION_LABELS[lang][car.transmission];
  const fuelTypeLabel = FUEL_TYPE_LABELS[lang][car.fuelType];

  return (
    <Card className="overflow-hidden group flex flex-col h-full border-border/50 hover:border-border transition-colors">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!car.isAvailable && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-1">
              {dict.cars.unavailable}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              {car.brand} {car.model}
            </h3>
            <p className="text-muted-foreground">{car.year}</p>
          </div>
          {car.pricing && (
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">
                {car.pricing.dailyRate}
              </span>
              <span className="text-sm text-muted-foreground font-medium ml-1">
                {dict.common.currency} {dict.cars.perDay}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary/70" />
            {car.seats} {dict.carDetails.seats}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary/70" />
            {car.luggageCapacity} {dict.carDetails.luggage}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Settings className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary/70" />
            {transmissionLabel}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Fuel className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary/70" />
            {fuelTypeLabel}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full font-semibold" variant={car.isAvailable ? "default" : "secondary"}>
          <Link href={`/${lang}/cars/${car.slug}`}>
            {dict.cars.viewDetails}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
