import type { RentalPeriod } from '@/core/domain';

class PricingServiceImpl {
  calculateTotal(dailyRate: number, weeklyRate: number, monthlyRate: number, period: RentalPeriod, days: number): number {
    switch (period) {
      case 'DAILY':
        return dailyRate * days;
      case 'WEEKLY': {
        const weeks = Math.ceil(days / 7);
        return weeklyRate * weeks;
      }
      case 'MONTHLY': {
        const months = Math.ceil(days / 30);
        return monthlyRate * months;
      }
    }
  }

  determinePeriod(days: number): RentalPeriod {
    if (days >= 30) return 'MONTHLY';
    if (days >= 7) return 'WEEKLY';
    return 'DAILY';
  }

  getRateForPeriod(dailyRate: number, weeklyRate: number, monthlyRate: number, period: RentalPeriod): number {
    switch (period) {
      case 'DAILY':
        return dailyRate;
      case 'WEEKLY':
        return weeklyRate;
      case 'MONTHLY':
        return monthlyRate;
    }
  }
}

export const PricingService = new PricingServiceImpl();
