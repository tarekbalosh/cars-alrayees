import type { Booking, CreateBookingInput, BookingStatus, PaymentStatus } from '@/core/domain';

export interface BookingRepository {
  findAll(): Promise<Booking[]>;
  findById(id: string): Promise<Booking | null>;
  findByCarId(carId: string): Promise<Booking[]>;
  create(data: CreateBookingInput): Promise<Booking>;
  updateStatus(id: string, status: BookingStatus): Promise<Booking>;
  updatePaymentStatus(id: string, paymentStatus: PaymentStatus, stripePaymentIntentId?: string): Promise<Booking>;
  delete(id: string): Promise<void>;
}
