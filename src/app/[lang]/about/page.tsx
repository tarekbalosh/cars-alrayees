import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.nav.about,
    description: dict.about.description,
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{dict.nav.about}</h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
      </div>
      
      <div className="prose prose-lg prose-muted max-w-none space-y-8">
        <p className="text-xl leading-relaxed">
          {dict.about?.description || "Welcome to Al Rayees Car Rental, your trusted partner for premium mobility solutions. We pride ourselves on delivering exceptional service, a diverse fleet of well-maintained vehicles, and a seamless rental experience tailored to your needs."}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div className="bg-muted/30 p-8 rounded-2xl text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">10+</h3>
            <p className="font-medium text-muted-foreground">Years Experience</p>
          </div>
          <div className="bg-muted/30 p-8 rounded-2xl text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">50+</h3>
            <p className="font-medium text-muted-foreground">Premium Cars</p>
          </div>
          <div className="bg-muted/30 p-8 rounded-2xl text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">10k+</h3>
            <p className="font-medium text-muted-foreground">Happy Clients</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6">Our Mission</h2>
        <p>
          To provide unparalleled car rental services that combine affordability, reliability, and luxury. We strive to make every journey memorable by ensuring our customers have access to the best vehicles and customer support at all times.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6">Our Vision</h2>
        <p>
          To become the leading car rental platform in the region, known for our innovative approach, exceptional fleet, and unwavering commitment to customer satisfaction.
        </p>
      </div>

      <div className="mt-16 text-center">
        <Button size="lg" asChild className="px-8">
          <Link href={`/${lang}/contact`}>
            {dict.contact.title}
          </Link>
        </Button>
      </div>
    </div>
  );
}
