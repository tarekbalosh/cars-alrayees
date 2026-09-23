import type { CarWithDetails, CarFilters, CarSort } from '@/core/domain';
import type { CarRepository } from '@/core/repositories';
import { PrismaCarRepository } from '@/infrastructure/database/repositories/PrismaCarRepository';

class CarServiceImpl {
  private repository: CarRepository;

  constructor(repository?: CarRepository) {
    this.repository = repository ?? new PrismaCarRepository();
  }

  async getCars(filters?: CarFilters, sort?: CarSort): Promise<CarWithDetails[]> {
    return this.repository.findAll(filters, sort);
  }

  async getCarById(id: string): Promise<CarWithDetails | null> {
    return this.repository.findById(id);
  }

  async getCarBySlug(slug: string): Promise<CarWithDetails | null> {
    return this.repository.findBySlug(slug);
  }

  async getFeaturedCars(): Promise<CarWithDetails[]> {
    return this.repository.findFeatured();
  }
}

// Singleton instance
export const CarService = new CarServiceImpl();
