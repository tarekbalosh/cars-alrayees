// Domain types for Booking & Payment — independent of any infrastructure

// ─── Booking ─────────────────────────────────────────────

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  carId: string;

  pickupDate: Date;
  pickupTime: string;
  returnDate: Date;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;

  rentalAmount: number;
  depositAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;

  status: BookingStatus;

  customerNotes: string | null;
  adminNotes: string | null;

  createdAt: Date;
  updatedAt: Date;
  paidAt: Date | null;
  cancelledAt: Date | null;
  completedAt: Date | null;
  expiresAt: Date | null;
}

export interface BookingWithRelations extends Booking {
  customer: Customer;
  car: BookingCar;
  payments?: Payment[];
}

export interface BookingCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  slug: string;
  images?: { url: string; isPrimary: boolean }[];
  pricing?: { dailyRate: number; weeklyRate: number; monthlyRate: number; securityDeposit: number; currency: string } | null;
}

export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_PROCESSING'
  | 'PAID'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED';

export type RentalPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface CreateBookingInput {
  customerId: string;
  carId: string;

  pickupDate: Date;
  pickupTime: string;
  returnDate: Date;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;

  customerNotes?: string;
  currency?: string;
}

export interface PriceBreakdown {
  rentalAmount: number;
  depositAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  numberOfDays: number;
  rentalPeriod: RentalPeriod;
}

// ─── Customer ────────────────────────────────────────────

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date | null;
  nationality: string | null;
  passportOrIdNumber: string | null;
  drivingLicenseNumber: string | null;
  drivingLicenseExpiry: Date | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postcode: string | null;
  country: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  nationality?: string;
  passportOrIdNumber?: string;
  drivingLicenseNumber?: string;
  drivingLicenseExpiry?: Date;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

// ─── Payment ─────────────────────────────────────────────

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;

  amount: number;
  currency: string;

  provider: PaymentProvider;
  paymentMethod: string | null;

  providerTransactionId: string | null;
  providerReference: string | null;
  providerOrderId: string | null;

  status: PaymentStatus;
  failureReason: string | null;

  paidAt: Date | null;

  refundAmount: number | null;
  refundedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentWithRelations extends Payment {
  booking?: Booking;
  customer?: Customer;
  events?: PaymentEvent[];
}

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentProvider = 'FIUU';

// ─── PaymentEvent ─────────────────────────────────────────

export interface PaymentEvent {
  id: string;
  paymentId: string;

  eventType: string;
  provider: string;
  providerTransactionId: string | null;

  verified: boolean;
  processed: boolean;

  payload: Record<string, unknown> | null;

  createdAt: Date;
}
