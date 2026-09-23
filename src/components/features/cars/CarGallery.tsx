'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import type { CarImage } from '@/core/domain';
import type { Locale } from '@/i18n';
import { cn } from '@/lib/utils';

interface CarGalleryProps {
  images: CarImage[];
  brand: string;
  lang: Locale;
}

export function CarGallery({ images, brand, lang }: CarGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const isRtl = lang === 'ar';

  React.useEffect(() => {
    if (!api) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const placeholderImages = Array.from({ length: 4 }).map((_, i) => ({
    id: `placeholder-${i}`,
    url: '/placeholder-car.jpg',
    isPrimary: i === 0,
    altAr: `${brand} - صورة ${i + 1}`,
    altEn: `${brand} - Image ${i + 1}`,
  }));

  const displayImages = images.length > 0 ? images : placeholderImages;

  return (
    <div className="space-y-4">
      {/* Main Image Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          direction: isRtl ? 'rtl' : 'ltr',
          align: 'start',
          loop: true,
        }}
        className="w-full relative group"
      >
        <CarouselContent>
          {displayImages.map((image) => {
            const altText = lang === 'ar' ? (image.altAr || brand) : (image.altEn || brand);
            return (
              <CarouselItem key={image.id}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
                    <span className="font-semibold">{altText}</span>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <CarouselPrevious className="relative static transform-none" />
          <CarouselNext className="relative static transform-none" />
        </div>
      </Carousel>

      {/* Thumbnails */}
      <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 snap-x">
        {displayImages.map((image, index) => {
          return (
            <button
              key={image.id}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "relative aspect-[4/3] w-20 sm:w-24 flex-shrink-0 snap-center overflow-hidden rounded-lg bg-muted transition-all",
                current === index ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-50 hover:opacity-100"
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground bg-muted">
                {index + 1}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
