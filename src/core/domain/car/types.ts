// Domain types for Car - independent of any infrastructure
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  slug: string;
  descriptionAr: string;
  descriptionEn: string;
  transmission: Transmission;
  fuelType: FuelType;
  seats: number;
  doors: number;
  engine: string;
  luggageCapacity: number;
  features: string[];
  isFeatured: boolean;
  isAvailable: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  images?: CarImage[];
  pricing?: CarPricing | null;
}

export interface CarWithDetails extends Car {
  category: Category;
  images: CarImage[];
  pricing: CarPricing | null;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarImage {
  id: string;
  carId: string;
  url: string;
  publicId: string | null;
  altAr: string | null;
  altEn: string | null;
  isPrimary: boolean;
  orderIndex: number;
  createdAt: Date;
}

export interface CarPricing {
  id: string;
  carId: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  currency: string;
  securityDeposit: number;
  createdAt: Date;
  updatedAt: Date;
}

export type Transmission = "AUTOMATIC" | "MANUAL";
export type FuelType = "PETROL" | "DIESEL" | "HYBRID" | "ELECTRIC";

export interface CarFilters {
  categorySlug?: string;
  transmission?: Transmission;
  fuelType?: FuelType;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  search?: string;
}

export type CarSortField = "price" | "year" | "name";
export type SortOrder = "asc" | "desc";

export interface CarSort {
  field: CarSortField;
  order: SortOrder;
}
