'use server';

import { prisma } from '@/infrastructure/database/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BookingStatus } from '@prisma/client';

export async function getBookings() {
  return prisma.booking.findMany({
    include: { car: true, customer: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  await prisma.booking.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/bookings');
}

export async function deleteBooking(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  await prisma.booking.delete({
    where: { id },
  });

  revalidatePath('/admin/bookings');
}
