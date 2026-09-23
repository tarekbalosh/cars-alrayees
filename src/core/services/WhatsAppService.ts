import type { CarWithDetails, RentalPeriod } from '@/core/domain';

class WhatsAppServiceImpl {
  private getWhatsAppNumber(): string {
    return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
  }

  generateBookingMessage(
    car: CarWithDetails,
    locale: string,
    period?: RentalPeriod,
    startDate?: string
  ): string {
    if (locale === 'ar') {
      return this.generateArabicMessage(car, period, startDate);
    }
    return this.generateEnglishMessage(car, period, startDate);
  }

  private generateArabicMessage(car: CarWithDetails, period?: RentalPeriod, startDate?: string): string {
    const periodLabels: Record<RentalPeriod, string> = {
      DAILY: 'يومي',
      WEEKLY: 'أسبوعي',
      MONTHLY: 'شهري',
    };

    let message = `مرحباً، أود الاستفسار عن حجز:\n\n`;
    message += `السيارة: ${car.brand} ${car.model} ${car.year}\n`;

    if (period && car.pricing) {
      message += `نوع الإيجار: ${periodLabels[period]}\n`;
      const rate =
        period === 'DAILY'
          ? car.pricing.dailyRate
          : period === 'WEEKLY'
          ? car.pricing.weeklyRate
          : car.pricing.monthlyRate;
      message += `السعر: ${rate} ${car.pricing.currency}\n`;
    }

    if (startDate) {
      message += `تاريخ البداية: ${startDate}\n`;
    }

    message += `\nهل السيارة متاحة؟`;
    return message;
  }

  private generateEnglishMessage(car: CarWithDetails, period?: RentalPeriod, startDate?: string): string {
    const periodLabels: Record<RentalPeriod, string> = {
      DAILY: 'Daily',
      WEEKLY: 'Weekly',
      MONTHLY: 'Monthly',
    };

    let message = `Hello, I would like to inquire about a booking:\n\n`;
    message += `Car: ${car.brand} ${car.model} ${car.year}\n`;

    if (period && car.pricing) {
      message += `Rental Type: ${periodLabels[period]}\n`;
      const rate =
        period === 'DAILY'
          ? car.pricing.dailyRate
          : period === 'WEEKLY'
          ? car.pricing.weeklyRate
          : car.pricing.monthlyRate;
      message += `Price: ${rate} ${car.pricing.currency}\n`;
    }

    if (startDate) {
      message += `Start Date: ${startDate}\n`;
    }

    message += `\nIs the car available?`;
    return message;
  }

  generateWhatsAppUrl(message: string): string {
    const phone = this.getWhatsAppNumber();
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
  }
}

export const WhatsAppService = new WhatsAppServiceImpl();
