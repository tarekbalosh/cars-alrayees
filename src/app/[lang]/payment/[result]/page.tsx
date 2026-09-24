import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PaymentResultPageProps {
  params: Promise<{ lang: string; result: string }>;
  searchParams: Promise<{ orderid?: string; reason?: string }>;
}

export default async function PaymentResultPage({ params, searchParams }: PaymentResultPageProps) {
  const { lang, result } = await params;
  const { orderid, reason } = await searchParams;
  
  if (!['success', 'failed', 'pending'].includes(result)) {
    notFound();
  }

  const dict = await getDictionary(lang as Locale);
  const isRtl = lang === 'ar';

  let icon = <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />;
  let title = lang === 'ar' ? 'تم الدفع بنجاح' : 'Payment Successful';
  let message = lang === 'ar' ? 'شكراً لك، تم تأكيد حجزك بنجاح. سنتواصل معك قريباً لتأكيد التفاصيل.' : 'Thank you, your booking has been confirmed successfully. We will contact you soon.';

  if (result === 'failed') {
    icon = <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />;
    title = lang === 'ar' ? 'فشل الدفع' : 'Payment Failed';
    message = lang === 'ar' ? 'عذراً، حدثت مشكلة أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.' : 'Sorry, there was an issue processing your payment. Please try again.';
  } else if (result === 'pending') {
    icon = <Clock className="w-24 h-24 text-yellow-500 mx-auto mb-6" />;
    title = lang === 'ar' ? 'الدفع قيد المعالجة' : 'Payment Pending';
    message = lang === 'ar' ? 'طلبك قيد المعالجة حالياً. سنقوم بتحديث حالة حجزك قريباً.' : 'Your request is currently being processed. We will update your booking status shortly.';
  }

  return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full bg-card border rounded-3xl p-8 text-center shadow-lg">
        {icon}
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground mb-6 text-lg">{message}</p>
        
        {orderid && (
          <div className="bg-muted/50 p-4 rounded-xl mb-8 border border-border/50">
            <span className="block text-sm text-muted-foreground mb-1">
              {lang === 'ar' ? 'رقم الحجز:' : 'Booking Reference:'}
            </span>
            <span className="block text-xl font-mono font-bold tracking-wider">{orderid}</span>
          </div>
        )}

        <div className="space-y-3">
          <Button asChild className="w-full h-12 text-lg">
            <Link href={`/${lang}`}>
              {lang === 'ar' ? 'العودة للرئيسية' : 'Return to Home'}
            </Link>
          </Button>
          
          {result === 'failed' && (
            <Button asChild variant="outline" className="w-full h-12 text-lg">
              <Link href={`/${lang}/cars`}>
                {lang === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
