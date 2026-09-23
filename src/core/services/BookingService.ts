import type { Booking, CreateBookingInput, BookingStatus } from '@/core/domain';
import type { BookingRepository } from '@/core/repositories';
import { PrismaBookingRepository } from '@/infrastructure/database/repositories/PrismaBookingRepository';

class BookingServiceImpl {
  private repository: BookingRepository;

  constructor(repository?: BookingRepository) {
    this.repository = repository ?? new PrismaBookingRepository();
  }

  async createBooking(data: CreateBookingInput): Promise<Booking> {
    return this.repository.create(data);
  }

  async getBookings(): Promise<Booking[]> {
    return this.repository.findAll();
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return this.repository.findById(id);
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    return this.repository.updateStatus(id, status);
  }
}

export const BookingService = new BookingServiceImpl();
