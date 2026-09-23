'use server';

import { prisma } from '@/infrastructure/database/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Transmission, FuelType } from '@prisma/client';

export async function getCars() {
  return prisma.car.findMany({
    include: { category: true, images: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteCar(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  await prisma.car.delete({
    where: { id },
  });

  revalidatePath('/admin/cars');
  revalidatePath('/[lang]/cars', 'page');
}

export async function createCar(data: Record<string, string>, imageUrls: string[]) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const car = await prisma.car.create({
    data: {
      brand: data.brand,
      model: data.model,
      year: parseInt(data.year),
      slug: `${data.brand.toLowerCase()}-${data.model.toLowerCase()}-${Date.now()}`.replace(/\s+/g, '-'),
      descriptionEn: data.descriptionEn,
      descriptionAr: data.descriptionAr,
      transmission: data.transmission as Transmission,
      fuelType: data.fuelType as FuelType,
      seats: parseInt(data.seats),
      doors: parseInt(data.doors),
      engine: data.engine,
      luggageCapacity: parseInt(data.luggageCapacity),
      isAvailable: data.isAvailable === 'true',
      categoryId: data.categoryId,
      pricing: {
        create: {
          dailyRate: parseFloat(data.dailyRate),
          weeklyRate: parseFloat(data.weeklyRate),
          monthlyRate: parseFloat(data.monthlyRate),
          securityDeposit: parseFloat(data.securityDeposit),
        }
      },
      images: {
        create: imageUrls.map((url, index) => ({
          url,
          isPrimary: index === 0,
        }))
      }
    },
  });

  revalidatePath('/admin/cars');
  revalidatePath('/[lang]/cars', 'page');
  return car.id;
}

export async function getCarById(id: string) {
  return prisma.car.findUnique({
    where: { id },
    include: { images: true, pricing: true },
  });
}

export async function updateCar(id: string, data: Record<string, string>, imageUrls: string[]) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const updateData: any = {
    brand: data.brand,
    model: data.model,
    year: parseInt(data.year),
    descriptionEn: data.descriptionEn,
    descriptionAr: data.descriptionAr,
    transmission: data.transmission as Transmission,
    fuelType: data.fuelType as FuelType,
    seats: parseInt(data.seats),
    doors: parseInt(data.doors),
    engine: data.engine,
    luggageCapacity: parseInt(data.luggageCapacity),
    isAvailable: data.isAvailable === 'true',
    categoryId: data.categoryId,
    pricing: {
      update: {
        dailyRate: parseFloat(data.dailyRate),
        weeklyRate: parseFloat(data.weeklyRate),
        monthlyRate: parseFloat(data.monthlyRate),
        securityDeposit: parseFloat(data.securityDeposit),
      }
    }
  };

  if (imageUrls && imageUrls.length > 0) {
    updateData.images = {
      create: imageUrls.map((url, index) => ({
        url,
        isPrimary: index === 0, // In a real app we'd preserve the existing primary logic
      }))
    };
  }

  const car = await prisma.car.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/admin/cars');
  revalidatePath('/[lang]/cars', 'page');
  return car.id;
}

export async function toggleCarStatus(id: string, isAvailable: boolean) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  await prisma.car.update({
    where: { id },
    data: { isAvailable },
  });

  revalidatePath('/admin/cars');
  revalidatePath('/[lang]/cars', 'page');
}
