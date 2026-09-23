'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCar, updateCar } from './actions';
import Image from 'next/image';

export function CarForm({ 
  categories, 
  lang,
  initialData
}: { 
  categories: { id: string; nameEn: string; nameAr: string }[]; 
  lang: string;
  initialData?: any;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images?.map((i: any) => i.url) || []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries()) as Record<string, string>;
      
      // Upload images first
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const imgData = new FormData();
        imgData.append('file', file);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: imgData,
        });
        
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const uploadResult = await uploadRes.json();
        imageUrls.push(uploadResult.secure_url);
      }

      // Create or update car with uploaded image URLs
      if (initialData) {
        await updateCar(initialData.id, data, imageUrls);
      } else {
        await createCar(data, imageUrls);
      }
      
      router.push(`/${lang}/admin/cars`);
    } catch (error) {
      console.error(error);
      alert('Failed to create car. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" name="brand" defaultValue={initialData?.brand || ""} required placeholder="e.g. Mercedes" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" name="model" defaultValue={initialData?.model || ""} required placeholder="e.g. S-Class" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" name="year" defaultValue={initialData?.year || ""} type="number" required placeholder="2024" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select 
            id="categoryId" 
            name="categoryId" defaultValue={initialData?.categoryId?.toString() || ""} 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.nameEn} / {c.nameAr}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="descriptionEn">Description (English)</Label>
          <Textarea id="descriptionEn" name="descriptionEn" defaultValue={initialData?.descriptionEn || ""} required />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="descriptionAr">Description (Arabic)</Label>
          <Textarea id="descriptionAr" name="descriptionAr" defaultValue={initialData?.descriptionAr || ""} required dir="rtl" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <select 
            id="transmission" 
            name="transmission" defaultValue={initialData?.transmission?.toString() || ""} 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="AUTOMATIC">Automatic</option>
            <option value="MANUAL">Manual</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <select 
            id="fuelType" 
            name="fuelType" defaultValue={initialData?.fuelType?.toString() || ""} 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="PETROL">Petrol</option>
            <option value="DIESEL">Diesel</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ELECTRIC">Electric</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seats">Seats</Label>
          <Input id="seats" name="seats" defaultValue={initialData?.seats || ""} type="number" required placeholder="5" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="doors">Doors</Label>
          <Input id="doors" name="doors" defaultValue={initialData?.doors || ""} type="number" required placeholder="4" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="engine">Engine</Label>
          <Input id="engine" name="engine" defaultValue={initialData?.engine || ""} required placeholder="e.g. 2.0L Turbo" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="luggageCapacity">Luggage Capacity</Label>
          <Input id="luggageCapacity" name="luggageCapacity" defaultValue={initialData?.luggageCapacity || ""} type="number" required placeholder="3" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dailyRate">Daily Rate (MYR)</Label>
          <Input id="dailyRate" name="dailyRate" defaultValue={initialData?.pricing?.dailyRate || ""} type="number" step="0.01" required placeholder="150" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weeklyRate">Weekly Rate (MYR)</Label>
          <Input id="weeklyRate" name="weeklyRate" defaultValue={initialData?.pricing?.weeklyRate || ""} type="number" step="0.01" required placeholder="900" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="monthlyRate">Monthly Rate (MYR)</Label>
          <Input id="monthlyRate" name="monthlyRate" defaultValue={initialData?.pricing?.monthlyRate || ""} type="number" step="0.01" required placeholder="3000" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="securityDeposit">Security Deposit (MYR)</Label>
          <Input id="securityDeposit" name="securityDeposit" defaultValue={initialData?.pricing?.securityDeposit || ""} type="number" step="0.01" required placeholder="1000" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="isAvailable">Status</Label>
          <select 
            id="isAvailable" 
            name="isAvailable" defaultValue={initialData?.isAvailable?.toString() || ""} 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="space-y-4 md:col-span-2">
          <Label>Car Images (Select one or multiple)</Label>
          <Input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
          
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-32 h-32 border rounded-lg overflow-hidden group">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-xs text-center py-1">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Car'}
        </Button>
      </div>
    </form>
  );
}
