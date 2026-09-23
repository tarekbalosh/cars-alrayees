import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { CarService } from '@/core/services';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await CarService.getCars();
  const locales = ['en', 'ar'];
  
  const routes = ['', '/cars', '/about', '/services', '/contact'].flatMap(route => 
    locales.map(locale => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  const carRoutes = cars.flatMap(car => 
    locales.map(locale => ({
      url: `${SITE_URL}/${locale}/cars/${car.slug}`,
      lastModified: car.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
  );

  return [...routes, ...carRoutes];
}
