import { prisma } from '@/infrastructure/database/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Tags, Calendar, CalendarCheck } from 'lucide-react';
import { Booking, Car as CarModel } from '@prisma/client';

export default async function AdminDashboardPage() {
  const [carsCount, categoriesCount, bookingsCount, recentBookings] = await Promise.all([
    prisma.car.count(),
    prisma.category.count(),
    prisma.booking.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { car: true, customer: true },
    })
  ]);

  const stats = [
    { title: 'Total Cars', value: carsCount, icon: Car },
    { title: 'Categories', value: categoriesCount, icon: Tags },
    { title: 'Total Bookings', value: bookingsCount, icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome to the Al Rayees Car Rental admin panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <CalendarCheck className="mr-2 h-5 w-5" />
          Recent Bookings
        </h2>
        <div className="bg-card border rounded-lg overflow-hidden">
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No bookings found.</div>
          ) : (
            <div className="divide-y">
              {recentBookings.map((booking: Booking & { car: CarModel, customer: any }) => (
                <div key={booking.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{booking.customer.fullName}</p>
                    <p className="text-sm text-muted-foreground">{booking.car.brand} {booking.car.model}</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                      {booking.status}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(booking.pickupDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
