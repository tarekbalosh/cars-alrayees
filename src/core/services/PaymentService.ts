import type { Payment, BookingWithRelations, CreateBookingInput } from '@/core/domain';

export interface PaymentService {
  /**
   * Initializes a payment session and returns the payment URL or credentials
   * needed for the client to proceed with payment.
   */
  createPayment(booking: BookingWithRelations): Promise<{ paymentUrl: string; parameters: Record<string, string> }>;
  
  /**
   * Verifies the authenticity of a webhook/callback from the payment gateway.
   */
  verifyWebhookSignature(payload: Record<string, string>): boolean;
  
  /**
   * Processes a webhook payload, updates the payment/booking status, and returns
   * the response string that should be sent back to the payment gateway (e.g. 'CBTOKEN:MPSTATOK')
   */
  handleWebhook(payload: Record<string, string>): Promise<string>;
}
