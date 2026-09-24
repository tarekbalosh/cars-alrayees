import { prisma } from '@/infrastructure/database/prisma';

export async function getCustomers() {
  return prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      bookings: {
        select: {
          id: true,
          status: true,
          pickupDate: true,
          returnDate: true,
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}
