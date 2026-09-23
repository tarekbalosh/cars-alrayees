import { getBookings, updateBookingStatus, deleteBooking } from './actions';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Booking, Car } from '@prisma/client';

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Car</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking: Booking & { car: Car }) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.customerName}</div>
                    <div className="text-sm text-muted-foreground">{booking.phone}</div>
                    <div className="text-sm text-muted-foreground">{booking.email}</div>
                  </TableCell>
                  <TableCell>
                    {booking.car.brand} {booking.car.model}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      Start: {booking.startDate.toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      End: {booking.endDate.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={booking.status === 'CONFIRMED' || booking.status === 'ACTIVE' ? "default" : "secondary"}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 items-center">
                      <form action={async () => {
                        'use server';
                        await updateBookingStatus(booking.id, 'CONFIRMED');
                      }}>
                        <Button type="submit" variant="outline" size="sm" disabled={booking.status === 'CONFIRMED'}>
                          Confirm
                        </Button>
                      </form>
                      <form action={async () => {
                        'use server';
                        await updateBookingStatus(booking.id, 'CANCELLED');
                      }}>
                        <Button type="submit" variant="outline" size="sm" className="text-destructive border-destructive" disabled={booking.status === 'CANCELLED'}>
                          Cancel
                        </Button>
                      </form>
                      <form action={async () => {
                        'use server';
                        await deleteBooking(booking.id);
                      }}>
                        <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
