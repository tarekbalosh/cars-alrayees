import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from '@/core/services';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let booking = await BookingService.getBookingById(id);
    if (!booking) {
      booking = await BookingService.getBookingByNumber(id);
    }

    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    // Usually frontend will poll this to know when Fiuu webhook updates the status
    return NextResponse.json({
      success: true,
      status: booking.status,
      bookingNumber: booking.bookingNumber,
    });
  } catch (error: any) {
    console.error('Error fetching booking status:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
