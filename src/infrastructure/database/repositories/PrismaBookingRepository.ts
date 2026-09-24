import type { Booking, CreateBookingInput, BookingStatus, BookingWithRelations } from '@/core/domain';
import type { BookingRepository } from '@/core/repositories';
import prisma from '@/infrastructure/database/prisma';

function mapBooking(booking: any): Booking {
  return {
    ...booking,
    rentalAmount: Number(booking.rentalAmount),
    depositAmount: Number(booking.depositAmount),
    taxAmount: Number(booking.taxAmount),
    discountAmount: Number(booking.discountAmount),
    totalAmount: Number(booking.totalAmount),
  } as Booking;
}

function mapBookingWithRelations(booking: any): BookingWithRelations {
  const mapped = mapBooking(booking) as BookingWithRelations;
  if (booking.customer) mapped.customer = booking.customer;
  if (booking.car) {
    mapped.car = {
      ...booking.car,
      pricing: booking.car.pricing ? {
        ...booking.car.pricing,
        dailyRate: Number(booking.car.pricing.dailyRate),
        weeklyRate: Number(booking.car.pricing.weeklyRate),
        monthlyRate: Number(booking.car.pricing.monthlyRate),
        securityDeposit: Number(booking.car.pricing.securityDeposit),
      } : null,
    };
  }
  if (booking.payments) {
    mapped.payments = booking.payments.map((p: any) => ({
      ...p,
      amount: Number(p.amount),
      refundAmount: p.refundAmount ? Number(p.refundAmount) : null
    }));
  }
  return mapped;
}

export class PrismaBookingRepository implements BookingRepository {
  async findAll(): Promise<BookingWithRelations[]> {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        car: { include: { images: true, pricing: true } },
        payments: true
      }
    });
    return bookings.map(mapBookingWithRelations);
  }

  async findById(id: string): Promise<BookingWithRelations | null> {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        car: { include: { images: true, pricing: true } },
        payments: true
      }
    });
    return booking ? mapBookingWithRelations(booking) : null;
  }

  async findByBookingNumber(bookingNumber: string): Promise<BookingWithRelations | null> {
    const booking = await prisma.booking.findUnique({
      where: { bookingNumber },
      include: {
        customer: true,
        car: { include: { images: true, pricing: true } },
        payments: true
      }
    });
    return booking ? mapBookingWithRelations(booking) : null;
  }

  async findByCarId(carId: string): Promise<Booking[]> {
    const bookings = await prisma.booking.findMany({
      where: { carId },
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map(mapBooking);
  }

  async create(data: CreateBookingInput & { bookingNumber: string, rentalAmount: number, depositAmount: number, taxAmount: number, discountAmount: number, totalAmount: number }): Promise<Booking> {
    const booking = await prisma.booking.create({
      data: {
        bookingNumber: data.bookingNumber,
        customerId: data.customerId,
        carId: data.carId,
        pickupDate: data.pickupDate,
        pickupTime: data.pickupTime,
        returnDate: data.returnDate,
        returnTime: data.returnTime,
        pickupLocation: data.pickupLocation,
        returnLocation: data.returnLocation,
        rentalAmount: data.rentalAmount,
        depositAmount: data.depositAmount,
        taxAmount: data.taxAmount,
        discountAmount: data.discountAmount,
        totalAmount: data.totalAmount,
        currency: data.currency ?? 'MYR',
        customerNotes: data.customerNotes,
        status: 'PENDING_PAYMENT',
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

  async delete(id: string): Promise<void> {
    await prisma.booking.delete({ where: { id } });
  }
}
