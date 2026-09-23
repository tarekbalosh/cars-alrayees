import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n';
import { Shield, Clock, MapPin, Key, HeartHandshake, PhoneCall } from 'lucide-react';

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const services = [
    {
      icon: <Key className="w-10 h-10 mb-4 text-primary" />,
      title: 'Daily & Weekly Rentals',
      description: 'Flexible short-term rental options perfect for business trips, weekend getaways, or when your car is in the shop.'
    },
    {
      icon: <Clock className="w-10 h-10 mb-4 text-primary" />,
      title: 'Long-term Leasing',
      description: 'Cost-effective monthly and yearly leasing solutions with maintenance included for ultimate peace of mind.'
    },
    {
      icon: <MapPin className="w-10 h-10 mb-4 text-primary" />,
      title: 'Airport Transfers',
      description: 'Punctual and comfortable pick-up and drop-off services to and from the airport.'
    },
    {
      icon: <Shield className="w-10 h-10 mb-4 text-primary" />,
      title: 'Chauffeur Services',
      description: 'Professional, multilingual drivers available for corporate events, weddings, or city tours.'
    },
    {
      icon: <HeartHandshake className="w-10 h-10 mb-4 text-primary" />,
      title: 'Corporate Accounts',
      description: 'Customized fleet solutions and dedicated account management for businesses of all sizes.'
    },
    {
      icon: <PhoneCall className="w-10 h-10 mb-4 text-primary" />,
      title: '24/7 Roadside Assistance',
      description: 'Round-the-clock support to ensure you are never stranded, no matter where your journey takes you.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{dict.nav.services}</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive mobility solutions designed to exceed your expectations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div key={idx} className="bg-card border border-border/50 rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1">
            {service.icon}
            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
