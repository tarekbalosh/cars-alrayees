import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from '@/core/services';
import { fiuuPaymentService } from '@/infrastructure/payments/fiuu';
import { CreateBookingInput, CreateCustomerInput } from '@/core/domain';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real app, use Zod for validation here
    const customerInput: CreateCustomerInput = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      nationality: body.nationality,
      passportOrIdNumber: body.passportOrIdNumber,
      drivingLicenseNumber: body.drivingLicenseNumber,
      drivingLicenseExpiry: body.drivingLicenseExpiry ? new Date(body.drivingLicenseExpiry) : undefined,
      address: body.address,
      city: body.city,
      state: body.state,
      postcode: body.postcode,
      country: body.country,
    };

    const bookingInput: CreateBookingInput = {
      customerId: '', // will be filled by service
      carId: body.carId,
      pickupDate: new Date(body.pickupDate),
      pickupTime: body.pickupTime,
      returnDate: new Date(body.returnDate),
      returnTime: body.returnTime,
      pickupLocation: body.pickupLocation,
      returnLocation: body.returnLocation,
      customerNotes: body.customerNotes,
    };

    // Process Booking (Validates availability, calculates price, generates booking number)
    const booking = await BookingService.processBooking(customerInput, bookingInput);

    // Initialize Fiuu Payment
    const paymentSession = await fiuuPaymentService.createPayment(booking);

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        totalAmount: booking.totalAmount,
      },
      payment: paymentSession
    });

  } catch (error: any) {
    console.error('Booking Creation Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create booking' }, { status: 400 });
  }
}
