import type { Category } from '@/core/domain';
import type { CategoryRepository } from '@/core/repositories';
import { PrismaCategoryRepository } from '@/infrastructure/database/repositories/PrismaCategoryRepository';

class CategoryServiceImpl {
  private repository: CategoryRepository;

  constructor(repository?: CategoryRepository) {
    this.repository = repository ?? new PrismaCategoryRepository();
  }

  async getCategories(): Promise<Category[]> {
    return this.repository.findAll();
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return this.repository.findBySlug(slug);
  }
}

export const CategoryService = new CategoryServiceImpl();
