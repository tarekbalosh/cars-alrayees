import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n';
import { CarService, CategoryService } from '@/core/services';
import { CarCard } from '@/components/shared/CarCard';
import { CarFilters } from '@/components/features/cars/CarFilters';
import type { CarFilters as DomainCarFilters, CarSort, CarWithDetails } from '@/core/domain';

interface CarsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CarsPage({ params, searchParams }: CarsPageProps) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  const dict = await getDictionary(lang as Locale);
  
  // Parse search params for filters
  const categorySlug = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
  const transmission = typeof resolvedSearchParams.transmission === 'string' ? (resolvedSearchParams.transmission as DomainCarFilters['transmission']) : undefined;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  
  const sortParam = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : undefined;
  
  const filters: DomainCarFilters = {
    categorySlug,
    transmission,
    search,
  };
  
  let sort: CarSort | undefined;
  if (sortParam) {
    const [field, order] = sortParam.split('_');
    sort = { field: field as CarSort['field'], order: order as 'asc' | 'desc' };
  }

  // Fetch data
  const [cars, categories] = await Promise.all([
    CarService.getCars(filters, sort),
    CategoryService.getCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{dict.cars.title}</h1>
        <p className="text-muted-foreground">{dict.cars.subtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4">
          <CarFilters categories={categories} dict={dict} lang={lang as Locale} />
        </div>

        {/* Cars Grid */}
        <div className="w-full lg:w-3/4">
          <div className="mb-6 flex justify-between items-center text-muted-foreground text-sm">
            <span>{cars.length} {dict.cars.title}</span>
          </div>
          
          {cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cars.map((car: CarWithDetails) => (
                <CarCard key={car.id} car={car} dict={dict} lang={lang as Locale} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-muted/30 rounded-xl">
              <p className="text-lg text-muted-foreground mb-4">{dict.cars.noResults}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
