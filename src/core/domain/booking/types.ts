// Domain types for Booking - independent of any infrastructure
export interface Booking {
  id: string;
  carId: string;
  customerName: string;
  phone: string;
  email: string;
  startDate: Date;
  endDate: Date;
  rentalPeriod: RentalPeriod;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type RentalPeriod = "DAILY" | "WEEKLY" | "MONTHLY";
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface CreateBookingInput {
  carId: string;
  customerName: string;
  phone: string;
  email: string;
  startDate: Date;
  endDate: Date;
  rentalPeriod: RentalPeriod;
  totalPrice: number;
  currency?: string;
  notes?: string;
}
