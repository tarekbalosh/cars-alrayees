import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{dict.nav.contact}</h1>
        <p className="text-xl text-muted-foreground">
          {dict.contact.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-muted/30 p-8 rounded-2xl border border-border/50">
            <h3 className="text-2xl font-bold mb-6">{dict.contact.title}</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-primary mt-1 mr-4 rtl:ml-4 rtl:mr-0" />
                <div>
                  <h4 className="font-semibold mb-1">Our Location</h4>
                  <p className="text-muted-foreground">123 Business Avenue, KLCC<br />50450 Kuala Lumpur, Malaysia</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-primary mt-1 mr-4 rtl:ml-4 rtl:mr-0" />
                <div>
                  <h4 className="font-semibold mb-1">{dict.contact.phone}</h4>
                  <p className="text-muted-foreground">+60 12-345 6789<br />+60 3-1234 5678</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-primary mt-1 mr-4 rtl:ml-4 rtl:mr-0" />
                <div>
                  <h4 className="font-semibold mb-1">{dict.contact.email}</h4>
                  <p className="text-muted-foreground">info@alrayees.com<br />support@alrayees.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-6 h-6 text-primary mt-1 mr-4 rtl:ml-4 rtl:mr-0" />
                <div>
                  <h4 className="font-semibold mb-1">Business Hours</h4>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
          <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help you?" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Write your message here..." 
                className="min-h-[150px] resize-none"
              />
            </div>
            
            <Button type="button" size="lg" className="w-full h-12 text-lg font-semibold">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
