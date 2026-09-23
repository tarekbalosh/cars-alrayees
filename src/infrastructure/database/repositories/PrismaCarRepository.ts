import type { Car, CarWithDetails, CarFilters, CarSort, CarPricing } from '@/core/domain';
import type { CarRepository } from '@/core/repositories';
import prisma from '@/infrastructure/database/prisma';
import type { Prisma } from '@prisma/client';

function mapPricing(pricing: { dailyRate: Prisma.Decimal; weeklyRate: Prisma.Decimal; monthlyRate: Prisma.Decimal; securityDeposit: Prisma.Decimal } & Record<string, unknown>) {
  return {
    ...pricing,
    dailyRate: Number(pricing.dailyRate),
    weeklyRate: Number(pricing.weeklyRate),
    monthlyRate: Number(pricing.monthlyRate),
    securityDeposit: Number(pricing.securityDeposit),
  } as unknown as CarPricing;
}

function mapCarWithDetails(car: Record<string, unknown> & { pricing?: Record<string, unknown> | null }): CarWithDetails {
  const result = car as unknown as CarWithDetails;
  if (car.pricing) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result.pricing = mapPricing(car.pricing as any);
  }
  return result;
}

const carInclude = {
  category: true,
  images: { orderBy: { orderIndex: 'asc' as const } },
  pricing: true,
};

export class PrismaCarRepository implements CarRepository {
  async findAll(filters?: CarFilters, sort?: CarSort): Promise<CarWithDetails[]> {
    const where: Prisma.CarWhereInput = {};

    if (filters) {
      if (filters.categorySlug) {
        where.category = { slug: filters.categorySlug };
      }
      if (filters.transmission) {
        where.transmission = filters.transmission;
      }
      if (filters.fuelType) {
        where.fuelType = filters.fuelType;
      }
      if (filters.isAvailable !== undefined) {
        where.isAvailable = filters.isAvailable;
      }
      if (filters.search) {
        where.OR = [
          { brand: { contains: filters.search, mode: 'insensitive' } },
          { model: { contains: filters.search, mode: 'insensitive' } },
          { descriptionEn: { contains: filters.search, mode: 'insensitive' } },
          { descriptionAr: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.pricing = {};
        if (filters.minPrice !== undefined) {
          where.pricing.dailyRate = { gte: filters.minPrice };
        }
        if (filters.maxPrice !== undefined) {
          where.pricing.dailyRate = {
            ...(where.pricing.dailyRate as object),
            lte: filters.maxPrice,
          };
        }
      }
    }

    const orderBy: Prisma.CarOrderByWithRelationInput = {};
    if (sort) {
      switch (sort.field) {
        case 'price':
          orderBy.pricing = { dailyRate: sort.order };
          break;
        case 'year':
          orderBy.year = sort.order;
          break;
        case 'name':
          orderBy.brand = sort.order;
          break;
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    const cars = await prisma.car.findMany({
      where,
      include: carInclude,
      orderBy,
    });

    return cars.map(mapCarWithDetails);
  }

  async findById(id: string): Promise<CarWithDetails | null> {
    const car = await prisma.car.findUnique({
      where: { id },
      include: carInclude,
    });
    return car ? mapCarWithDetails(car) : null;
  }

  async findBySlug(slug: string): Promise<CarWithDetails | null> {
    const car = await prisma.car.findUnique({
      where: { slug },
      include: carInclude,
    });
    return car ? mapCarWithDetails(car) : null;
  }

  async findFeatured(): Promise<CarWithDetails[]> {
    const cars = await prisma.car.findMany({
      where: { isFeatured: true, isAvailable: true },
      include: carInclude,
      orderBy: { createdAt: 'desc' },
    });
    return cars.map(mapCarWithDetails);
  }

  async create(data: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<Car> {
    return prisma.car.create({
      data: {
        brand: data.brand,
        model: data.model,
        year: data.year,
        slug: data.slug,
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        transmission: data.transmission,
        fuelType: data.fuelType,
        seats: data.seats,
        doors: data.doors,
        engine: data.engine,
        luggageCapacity: data.luggageCapacity,
        features: data.features,
        isFeatured: data.isFeatured,
        isAvailable: data.isAvailable,
        categoryId: data.categoryId,
      },
    }) as unknown as Car;
  }

  async update(id: string, data: Partial<Car>): Promise<Car> {
    return prisma.car.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
    }) as unknown as Car;
  }

  async delete(id: string): Promise<void> {
    await prisma.car.delete({ where: { id } });
  }
}
