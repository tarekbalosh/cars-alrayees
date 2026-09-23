import { z } from 'zod/v4';

export const bookingSchema = z.object({
  carId: z.string().min(1, 'Car ID is required'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(8, 'Phone number must be at least 8 characters'),
  email: z.email('Invalid email address'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  rentalPeriod: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  notes: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
