import { prisma } from '@/infrastructure/database/prisma';
import { CarForm } from '../../CarForm';
import { notFound } from 'next/navigation';
import { getCarById } from '../../actions';

export default async function EditCarPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
  const { lang, id } = await params;
  
  const categories = await prisma.category.findMany({
    select: { id: true, nameEn: true, nameAr: true },
    orderBy: { createdAt: 'desc' }
  });

  const car = await getCarById(id);

  if (!car) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Car: {car.brand} {car.model}</h1>
        <p className="text-muted-foreground">Update the car details.</p>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <CarForm categories={categories} lang={lang} initialData={car} />
      </div>
    </div>
  );
}
