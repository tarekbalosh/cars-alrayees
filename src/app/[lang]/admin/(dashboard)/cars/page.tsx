import { getCars, deleteCar } from './actions';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Car, Category } from '@prisma/client';
import { CarStatusToggle } from './CarStatusToggle';

export default async function CarsAdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const cars = await getCars();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cars Management</h1>
        <Button asChild>
          <Link href={`/${lang}/admin/cars/new`}>
            <Plus className="mr-2 h-4 w-4" /> Add Car
          </Link>
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No cars found.
                </TableCell>
              </TableRow>
            ) : (
              cars.map((car: Car & { category?: Category | null }) => (
                <TableRow key={car.id}>
                  <TableCell className="font-medium">
                    {car.brand} {car.model}
                  </TableCell>
                  <TableCell>{car.category?.nameEn}</TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>
                    <CarStatusToggle carId={car.id} initialStatus={car.isAvailable} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                        <Link href={`/${lang}/admin/cars/${car.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <form action={async () => {
                        'use server';
                        await deleteCar(car.id);
                      }}>
                        <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
