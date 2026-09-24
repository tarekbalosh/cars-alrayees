import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from '@/core/services';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // We try by ID first, then fallback to bookingNumber for flexibility
    let booking = await BookingService.getBookingById(id);
    if (!booking) {
      booking = await BookingService.getBookingByNumber(id);
    }

    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        pickupDate: booking.pickupDate,
        returnDate: booking.returnDate,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        car: {
          brand: booking.car?.brand,
          model: booking.car?.model,
          year: booking.car?.year,
        },
        customer: {
          firstName: booking.customer?.firstName,
          lastName: booking.customer?.lastName,
          email: booking.customer?.email,
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
