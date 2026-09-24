import { NextRequest, NextResponse } from 'next/server';
import { fiuuPaymentService } from '@/infrastructure/payments/fiuu';

export async function POST(request: NextRequest) {
  try {
    // Fiuu typically sends webhooks as application/x-www-form-urlencoded
    const formData = await request.formData();
    
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      payload[key] = value.toString();
    });

    console.log('Received Fiuu Webhook Payload:', payload);

    // According to Fiuu docs, we should respond with CBTOKEN:MPSTATOK
    const responseString = await fiuuPaymentService.handleWebhook(payload);

    return new NextResponse(responseString, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error handling Fiuu webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
