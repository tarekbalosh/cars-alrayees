import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Fuel, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const isRtl = lang === 'ar';

  return (
    <Card className="overflow-hidden group flex flex-col h-full rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {!car.isAvailable && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <Badge variant="destructive" className="text-lg px-6 py-2 rounded-xl shadow-lg">
              {dict.cars.unavailable}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6 flex-1 flex flex-col relative z-10 bg-card">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {car.brand} {car.model}
            </h3>
            <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
              {car.year}
            </div>
          </div>
          {car.pricing && (
            <div className="text-right flex flex-col items-end shrink-0 pl-2 rtl:pl-0 rtl:pr-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-primary">
                  {car.pricing.dailyRate}
                </span>
                <span className="text-sm font-bold text-primary/70">
                  {dict.common.currency}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-medium mt-0.5">
                {dict.cars.perDay}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/40 rounded-xl p-2.5 border border-border/40 transition-colors group-hover:bg-muted/60">
            <Users className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary/70 shrink-0" />
            <span className="truncate">{car.seats} {dict.carDetails.seats}</span>
          </div>
          <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/40 rounded-xl p-2.5 border border-border/40 transition-colors group-hover:bg-muted/60">
            <Briefcase className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary/70 shrink-0" />
            <span className="truncate">{car.luggageCapacity} {dict.carDetails.luggage}</span>
          </div>
          <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/40 rounded-xl p-2.5 border border-border/40 transition-colors group-hover:bg-muted/60">
            <Settings className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary/70 shrink-0" />
            <span className="truncate">{transmissionLabel}</span>
          </div>
          <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/40 rounded-xl p-2.5 border border-border/40 transition-colors group-hover:bg-muted/60">
            <Fuel className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary/70 shrink-0" />
            <span className="truncate">{fuelTypeLabel}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 bg-card">
        <Button 
          asChild 
          className="w-full h-12 rounded-xl font-bold text-base shadow-sm hover:shadow-md transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-4 group-hover:ring-primary/20" 
          variant={car.isAvailable ? "default" : "secondary"}
        >
          <Link href={`/${lang}/cars/${car.slug}`} className="flex items-center justify-center gap-2">
            {dict.cars.viewDetails}
            {isRtl ? (
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
