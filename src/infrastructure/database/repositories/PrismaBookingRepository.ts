import type { Booking, CreateBookingInput, BookingStatus, PaymentStatus } from '@/core/domain';
import type { BookingRepository } from '@/core/repositories';
import prisma from '@/infrastructure/database/prisma';

function mapBooking(booking: Record<string, unknown>): Booking {
  return {
    ...booking,
    totalPrice: Number(booking.totalPrice),
  } as Booking;
}

export class PrismaBookingRepository implements BookingRepository {
  async findAll(): Promise<Booking[]> {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map(mapBooking);
  }

  async findById(id: string): Promise<Booking | null> {
    const booking = await prisma.booking.findUnique({ where: { id } });
    return booking ? mapBooking(booking) : null;
  }

  async findByCarId(carId: string): Promise<Booking[]> {
    const bookings = await prisma.booking.findMany({
      where: { carId },
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map(mapBooking);
  }

  async create(data: CreateBookingInput): Promise<Booking> {
    const booking = await prisma.booking.create({
      data: {
        carId: data.carId,
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        startDate: data.startDate,
        endDate: data.endDate,
        rentalPeriod: data.rentalPeriod,
        totalPrice: data.totalPrice,
        currency: data.currency ?? 'MYR',
        notes: data.notes,
      },
    });
    return mapBooking(booking);
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });
    return mapBooking(booking);
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
    stripePaymentIntentId?: string
  ): Promise<Booking> {
    const booking = await prisma.booking.update({
      where: { id },
      data: { paymentStatus, stripePaymentIntentId },
    });
    return mapBooking(booking);
  }

  async delete(id: string): Promise<void> {
    await prisma.booking.delete({ where: { id } });
  }
}
