'use server';

import { prisma } from '@/infrastructure/database/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createCategory(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const nameAr = formData.get('nameAr') as string;
  const nameEn = formData.get('nameEn') as string;

  if (!nameAr || !nameEn) throw new Error('Missing required fields');

  await prisma.category.create({
    data: { 
      nameAr, 
      nameEn,
      slug: nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
    },
  });

  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath('/admin/categories');
}
