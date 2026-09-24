'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function BookingForm({ carId, initialDays, pricing, lang, dict }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default dates
  const today = new Date();
  const tmr = new Date(today);
  tmr.setDate(tmr.getDate() + 1);
  
  const future = new Date(tmr);
  future.setDate(future.getDate() + initialDays);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pickupDate: tmr.toISOString().split('T')[0],
    pickupTime: '10:00',
    returnDate: future.toISOString().split('T')[0],
    returnTime: '10:00',
    pickupLocation: lang === 'ar' ? 'المكتب الرئيسي' : 'Main Office',
    returnLocation: lang === 'ar' ? 'المكتب الرئيسي' : 'Main Office',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          carId
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create booking');
      }

      // We have a payment URL from Fiuu!
      // In Fiuu Hosted Payment, we usually need to construct a form and submit it via POST
      // However, if the API returns a direct GET URL or parameters, we handle it here.
      if (data.payment && data.payment.paymentUrl) {
        // Build a form dynamically and submit it
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.payment.paymentUrl;

        Object.keys(data.payment.parameters).forEach(key => {
          const hiddenField = document.createElement('input');
          hiddenField.type = 'hidden';
          hiddenField.name = key;
          hiddenField.value = data.payment.parameters[key];
          form.appendChild(hiddenField);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error('Payment gateway error');
      }

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{lang === 'ar' ? 'الاسم الأول' : 'First Name'} *</Label>
          <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{lang === 'ar' ? 'الاسم الأخير' : 'Last Name'} *</Label>
          <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} *</Label>
          <Input id="email" type="email" name="email" required value={formData.email} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{lang === 'ar' ? 'رقم الهاتف (واتساب)' : 'Phone (WhatsApp)'} *</Label>
          <Input id="phone" type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
        </div>
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">{lang === 'ar' ? 'تفاصيل الاستلام والتسليم' : 'Pickup & Return Details'}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="pickupDate">{lang === 'ar' ? 'تاريخ الاستلام' : 'Pickup Date'} *</Label>
            <Input id="pickupDate" type="date" name="pickupDate" required min={new Date().toISOString().split('T')[0]} value={formData.pickupDate} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickupTime">{lang === 'ar' ? 'وقت الاستلام' : 'Pickup Time'} *</Label>
            <Input id="pickupTime" type="time" name="pickupTime" required value={formData.pickupTime} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="returnDate">{lang === 'ar' ? 'تاريخ التسليم' : 'Return Date'} *</Label>
            <Input id="returnDate" type="date" name="returnDate" required min={formData.pickupDate} value={formData.returnDate} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="returnTime">{lang === 'ar' ? 'وقت التسليم' : 'Return Time'} *</Label>
            <Input id="returnTime" type="time" name="returnTime" required value={formData.returnTime} onChange={handleChange} />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-lg mt-8" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {lang === 'ar' ? 'المتابعة للدفع الآمن' : 'Proceed to Secure Payment'}
      </Button>
    </form>
  );
}
