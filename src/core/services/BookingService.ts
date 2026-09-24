import type { Booking, CreateBookingInput, BookingStatus, BookingWithRelations, CreateCustomerInput, Customer, RentalPeriod } from '@/core/domain';
import type { BookingRepository, CarRepository, CustomerRepository } from '@/core/repositories';
import { PrismaBookingRepository } from '@/infrastructure/database/repositories/PrismaBookingRepository';
import { PrismaCarRepository } from '@/infrastructure/database/repositories/PrismaCarRepository';
import { PrismaCustomerRepository } from '@/infrastructure/database/repositories/PrismaCustomerRepository';
import prisma from '@/infrastructure/database/prisma';
import { PricingService } from './PricingService';
import { generateBookingNumber } from '@/lib/utils';

class BookingServiceImpl {
  private bookingRepo: BookingRepository;
  private carRepo: CarRepository;
  private customerRepo: CustomerRepository;

  constructor(
    bookingRepo?: BookingRepository,
    carRepo?: CarRepository,
    customerRepo?: CustomerRepository
  ) {
    this.bookingRepo = bookingRepo ?? new PrismaBookingRepository();
    this.carRepo = carRepo ?? new PrismaCarRepository();
    this.customerRepo = customerRepo ?? new PrismaCustomerRepository();
  }

  async processBooking(customerInput: CreateCustomerInput, bookingInput: CreateBookingInput): Promise<BookingWithRelations> {
    // 1. Validate / Get / Create Customer
    let customer = await this.customerRepo.findByEmail(customerInput.email);
    if (!customer) {
      customer = await this.customerRepo.create(customerInput);
    } else {
      // Optionally update customer info if needed
      customer = await this.customerRepo.update(customer.id, customerInput);
    }

    // 2. Validate Car Availability
    const car = await this.carRepo.findById(bookingInput.carId);
    if (!car || !car.isAvailable || !car.pricing) {
      throw new Error('Car is not available for booking');
    }

    // 3. Prevent Double Booking
    // Find any existing active bookings that overlap with the requested dates
    const overlappingBookings = await prisma.booking.findFirst({
      where: {
        carId: car.id,
        status: {
          notIn: ['CANCELLED', 'REFUNDED', 'EXPIRED'] // Ignore these statuses
        },
        OR: [
          {
            // Case 1: Requested start is within an existing booking
            pickupDate: { lte: bookingInput.pickupDate },
            returnDate: { gte: bookingInput.pickupDate }
          },
          {
            // Case 2: Requested end is within an existing booking
            pickupDate: { lte: bookingInput.returnDate },
            returnDate: { gte: bookingInput.returnDate }
          },
          {
            // Case 3: Requested dates completely encapsulate an existing booking
            pickupDate: { gte: bookingInput.pickupDate },
            returnDate: { lte: bookingInput.returnDate }
          }
        ]
      }
    });

    if (overlappingBookings) {
      throw new Error('Car is already booked for the selected dates');
    }

    // 4. Calculate Price on Backend
    const pickup = new Date(bookingInput.pickupDate);
    const returnDate = new Date(bookingInput.returnDate);
    const diffTime = Math.abs(returnDate.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day

    const period = PricingService.determinePeriod(diffDays);
    const rentalAmount = PricingService.calculateTotal(
      Number(car.pricing.dailyRate),
      Number(car.pricing.weeklyRate),
      Number(car.pricing.monthlyRate),
      period,
      diffDays
    );

    const depositAmount = Number(car.pricing.securityDeposit);
    const taxAmount = 0; // Configurable tax
    const discountAmount = 0; // Configurable discount
    const totalAmount = rentalAmount + depositAmount + taxAmount - discountAmount;

    // 5. Generate Booking Number
    const bookingNumber = generateBookingNumber();

    // 6. Create Booking
    const booking = await this.bookingRepo.create({
      ...bookingInput,
      customerId: customer.id,
      bookingNumber,
      rentalAmount,
      depositAmount,
      taxAmount,
      discountAmount,
      totalAmount
    });

    return (await this.bookingRepo.findById(booking.id))!;
  }

  async getBookings(): Promise<BookingWithRelations[]> {
    return this.bookingRepo.findAll();
  }

  async getBookingById(id: string): Promise<BookingWithRelations | null> {
    return this.bookingRepo.findById(id);
  }

  async getBookingByNumber(bookingNumber: string): Promise<BookingWithRelations | null> {
    return this.bookingRepo.findByBookingNumber(bookingNumber);
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    return this.bookingRepo.updateStatus(id, status);
  }

  async expirePendingBookings(): Promise<void> {
    // Timeout mechanism for PENDING_PAYMENT
    // Logic will be implemented based on cron job or checking during fetch
  }
}

export const BookingService = new BookingServiceImpl();
