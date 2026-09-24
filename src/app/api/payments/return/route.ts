import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return handleReturn(request);
}

export async function GET(request: NextRequest) {
  return handleReturn(request);
}

async function handleReturn(request: NextRequest) {
  let payload: Record<string, string> = {};

  if (request.method === 'POST') {
    const formData = await request.formData();
    formData.forEach((value, key) => {
      payload[key] = value.toString();
    });
  } else {
    request.nextUrl.searchParams.forEach((value, key) => {
      payload[key] = value;
    });
  }

  const { orderid, status } = payload;
  
  // Basic fallback if missing
  if (!orderid) {
    return NextResponse.redirect(new URL('/en/payment/failed?reason=missing_order', request.url));
  }

  // Determine redirection based on status
  // 00 = Success, 11 = Failed, 22 = Pending
  let resultPath = 'failed';
  if (status === '00') {
    resultPath = 'success';
  } else if (status === '22') {
    resultPath = 'pending';
  }

  // We redirect to the English version by default. 
  // In a real multi-lang setup we might pass lang in state or infer from cookies.
  return NextResponse.redirect(new URL(`/en/payment/${resultPath}?orderid=${orderid}`, request.url));
}
