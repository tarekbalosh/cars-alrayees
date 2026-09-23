import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">{dict.hero.title}</h1>
      <p className="text-muted-foreground text-lg">{dict.hero.subtitle}</p>
    </main>
  );
}
