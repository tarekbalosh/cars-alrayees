import type { Category } from '@/core/domain';
import type { CategoryRepository } from '@/core/repositories';
import prisma from '@/infrastructure/database/prisma';

export class PrismaCategoryRepository implements CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { nameEn: 'asc' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { slug } });
  }

  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}
