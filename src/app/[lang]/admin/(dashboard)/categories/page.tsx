import { getCategories, createCategory, deleteCategory } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { Category } from '@prisma/client';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Add Category</h2>
            <form action={createCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nameEn">Name (English)</Label>
                <Input id="nameEn" name="nameEn" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameAr">Name (Arabic)</Label>
                <Input id="nameAr" name="nameAr" required dir="rtl" />
              </div>
              <Button type="submit" className="w-full">Save Category</Button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-card border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>English Name</TableHead>
                  <TableHead>Arabic Name</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat: Category) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.nameEn}</TableCell>
                      <TableCell>{cat.nameAr}</TableCell>
                      <TableCell className="text-right">
                        <form action={async () => {
                          'use server';
                          await deleteCategory(cat.id);
                        }}>
                          <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
