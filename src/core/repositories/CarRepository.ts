import type { Car, CarWithDetails, CarFilters, CarSort } from '@/core/domain';

export interface CarRepository {
  findAll(filters?: CarFilters, sort?: CarSort): Promise<CarWithDetails[]>;
  findById(id: string): Promise<CarWithDetails | null>;
  findBySlug(slug: string): Promise<CarWithDetails | null>;
  findFeatured(): Promise<CarWithDetails[]>;
  create(data: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<Car>;
  update(id: string, data: Partial<Car>): Promise<Car>;
  delete(id: string): Promise<void>;
}
