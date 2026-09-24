import type { Customer, CreateCustomerInput } from '@/core/domain';

export interface CustomerRepository {
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  create(data: CreateCustomerInput): Promise<Customer>;
  update(id: string, data: Partial<CreateCustomerInput>): Promise<Customer>;
}
