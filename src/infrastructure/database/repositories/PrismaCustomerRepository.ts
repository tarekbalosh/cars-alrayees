import type { Customer, CreateCustomerInput } from '@/core/domain';
import type { CustomerRepository } from '@/core/repositories/CustomerRepository';
import prisma from '@/infrastructure/database/prisma';

export class PrismaCustomerRepository implements CustomerRepository {
  async findAll(): Promise<Customer[]> {
    return prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Customer | null> {
    return prisma.customer.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return prisma.customer.findUnique({
      where: { email },
    });
  }

  async create(data: CreateCustomerInput): Promise<Customer> {
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    return prisma.customer.create({
      data: {
        ...data,
        fullName,
      },
    });
  }

  async update(id: string, data: Partial<CreateCustomerInput>): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data,
    });
  }
}
