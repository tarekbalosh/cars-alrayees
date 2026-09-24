import { prisma } from '@/infrastructure/database/prisma';

export async function getPayments() {
  return prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      booking: {
        include: {
          customer: true,
          car: true
        }
      }
    }
  });
}
