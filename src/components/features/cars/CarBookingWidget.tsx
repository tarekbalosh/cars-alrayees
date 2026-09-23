'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Pricing {
  dailyRate: any;
  securityDeposit: any;
}

interface Translations {
  currency: string;
  perDay: string;
  securityDeposit: string;
  inquireWhatsApp: string;
  bookNow: string;
  rentalDuration: string;
  totalPrice: string;
}

interface CarBookingWidgetProps {
  pricing: Pricing | null;
  carBrand: string;
  carModel: string;
  whatsappNumber: string;
  t: Translations;
  lang: string;
  isAvailable: boolean;
}

export function CarBookingWidget({ pricing, carBrand, carModel, whatsappNumber, t, lang, isAvailable }: CarBookingWidgetProps) {
  const [days, setDays] = React.useState<number>(1);
  const isRtl = lang === 'ar';

  const dailyRateNum = pricing ? Number(pricing.dailyRate) : 0;
  const totalPrice = dailyRateNum * days;

  const whatsappMessage = encodeURIComponent(
    isRtl 
      ? `مرحباً، أنا مهتم باستئجار سيارة ${carBrand} ${carModel} لمدة ${days} أيام.`
      : `Hi, I'm interested in renting the ${carBrand} ${carModel} for ${days} days.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      setDays(val);
    } else if (e.target.value === '') {
      setDays(0);
    }
  };

  const handleBlur = () => {
    if (days < 1) {
      setDays(1);
    }
  };

  return (
    <div className="bg-muted/30 p-8 rounded-2xl border border-border/50 space-y-6">
      {pricing ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
            <div>
              <span className="text-4xl font-bold text-primary">{pricing.dailyRate}</span>
              <span className="text-muted-foreground font-medium ml-2 rtl:ml-0 rtl:mr-2">
                {t.currency} / {t.perDay}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>{t.securityDeposit}: {pricing.securityDeposit} {t.currency}</p>
            </div>
          </div>
          
          <div className="space-y-3 bg-background p-4 rounded-xl border border-border/50">
            <Label htmlFor="rental-days" className="text-base font-semibold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              {t.rentalDuration}
            </Label>
            <div className="flex items-center gap-4">
              <div className="w-1/3">
                <Input 
                  id="rental-days"
                  type="number" 
                  min="1" 
                  value={days === 0 ? '' : days} 
                  onChange={handleDaysChange}
                  onBlur={handleBlur}
                  className="h-14 text-xl text-center font-bold bg-muted/20"
                />
              </div>
              <div className="flex-1 text-center bg-primary/5 p-3 rounded-xl border border-primary/10">
                <span className="block text-xs text-primary/70 uppercase font-bold tracking-wider mb-1">{t.totalPrice}</span>
                <span className="block text-2xl sm:text-3xl font-bold text-primary">{totalPrice.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">{t.currency}</span></span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-xl font-semibold">{t.inquireWhatsApp}</div>
      )}
      
      {isAvailable ? (
        <Button size="lg" asChild className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Phone className={isRtl ? "w-5 h-5 ml-2" : "w-5 h-5 mr-2"} />
            {t.bookNow}
          </a>
        </Button>
      ) : (
        <Button size="lg" disabled className="w-full h-14 text-lg font-semibold">
          <Phone className={isRtl ? "w-5 h-5 ml-2" : "w-5 h-5 mr-2"} />
          {t.bookNow}
        </Button>
      )}
    </div>
  );
}
