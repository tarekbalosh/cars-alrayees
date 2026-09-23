import { getCategories } from '../../categories/actions';
import { CarForm } from '../CarForm';

export default async function NewCarPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Car</h1>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <CarForm categories={categories} lang={lang} />
      </div>
    </div>
  );
}
