import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n';
import { CarService } from '@/core/services';
import { BookingForm } from './BookingForm';
import Image from 'next/image';

interface BookPageProps {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ days?: string }>;
}

export default async function BookPage({ params, searchParams }: BookPageProps) {
  const { lang, slug } = await params;
  const { days } = await searchParams;
  
  const dict = await getDictionary(lang as Locale);
  const car = await CarService.getCarBySlug(slug);
  
  if (!car || !car.pricing) {
    notFound();
  }

  const initialDays = days ? parseInt(days, 10) : 1;
  const primaryImage = car.images?.find((img) => img.isPrimary) || car.images?.[0];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        {lang === 'ar' ? 'إتمام الحجز' : 'Complete Booking'}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">
              {lang === 'ar' ? 'بيانات المستأجر' : 'Renter Details'}
            </h2>
            <BookingForm 
              carId={car.id} 
              initialDays={initialDays} 
              pricing={car.pricing} 
              lang={lang as Locale} 
              dict={dict} 
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-muted/30 border rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold mb-4">{lang === 'ar' ? 'ملخص الحجز' : 'Booking Summary'}</h3>
            
            <div className="flex gap-4 mb-6">
              {primaryImage && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                  <Image 
                    src={primaryImage.url} 
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h4 className="font-semibold text-lg">{car.brand} {car.model}</h4>
                <p className="text-muted-foreground">{car.year}</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{lang === 'ar' ? 'الإيجار اليومي' : 'Daily Rate'}</span>
                <span className="font-medium">{Number(car.pricing.dailyRate).toLocaleString()} {dict.common.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{lang === 'ar' ? 'مبلغ التأمين' : 'Security Deposit'}</span>
                <span className="font-medium">{Number(car.pricing.securityDeposit).toLocaleString()} {dict.common.currency}</span>
              </div>
              
              <div className="mt-4 bg-primary/10 p-4 rounded-xl flex justify-between items-center">
                <span className="font-bold text-primary">{lang === 'ar' ? 'الإجمالي المتوقع' : 'Expected Total'}</span>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">{lang === 'ar' ? 'سيتم حسابه نهائياً بناءً على التواريخ' : 'Will be calculated based on dates'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
