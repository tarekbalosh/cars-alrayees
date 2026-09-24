import type { Booking, CreateBookingInput, BookingStatus, BookingWithRelations } from '@/core/domain';

export interface BookingRepository {
  findAll(): Promise<BookingWithRelations[]>;
  findById(id: string): Promise<BookingWithRelations | null>;
  findByBookingNumber(bookingNumber: string): Promise<BookingWithRelations | null>;
  findByCarId(carId: string): Promise<Booking[]>;
  create(data: CreateBookingInput & { bookingNumber: string, rentalAmount: number, depositAmount: number, taxAmount: number, discountAmount: number, totalAmount: number }): Promise<Booking>;
  updateStatus(id: string, status: BookingStatus): Promise<Booking>;
  delete(id: string): Promise<void>;
}
