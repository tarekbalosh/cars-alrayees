'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import type { Category } from '@/core/domain';
import type { Dictionary, Locale } from '@/i18n';
import { TRANSMISSION_LABELS, FUEL_TYPE_LABELS } from '@/lib/constants';

interface CarFiltersProps {
  categories: Category[];
  dict: Dictionary;
  lang: Locale;
}

export function CarFilters({ categories, dict, lang }: CarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for immediate UI feedback
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch] = useDebounce(search, 500);

  const updateFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Sync search URL param when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== (searchParams.get('search') || '')) {
      updateFilter('search', debouncedSearch || null);
    }
  }, [debouncedSearch, searchParams, updateFilter]);

  const clearFilters = () => {
    setSearch('');
    router.push(`?`, { scroll: false });
  };

  const hasActiveFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <div className="bg-muted/30 p-6 rounded-xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{dict.cars.filters}</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-8">
            <X className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {dict.cars.clearFilters}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">{dict.cars.search}</Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
            <Input
              id="search"
              placeholder={dict.cars.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rtl:pr-9 rtl:pl-3"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>{dict.cars.category}</Label>
          <Select
            value={searchParams.get('category') || 'all'}
            onValueChange={(val) => updateFilter('category', val === 'all' ? null : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={dict.cars.allCategories} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dict.cars.allCategories}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {lang === 'ar' ? c.nameAr : c.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transmission */}
        <div className="space-y-2">
          <Label>{dict.cars.transmission}</Label>
          <Select
            value={searchParams.get('transmission') || 'all'}
            onValueChange={(val) => updateFilter('transmission', val === 'all' ? null : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={dict.cars.allTransmissions} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dict.cars.allTransmissions}</SelectItem>
              {Object.entries(TRANSMISSION_LABELS[lang]).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fuel Type */}
        <div className="space-y-2">
          <Label>{dict.cars.fuelType}</Label>
          <Select
            value={searchParams.get('fuelType') || 'all'}
            onValueChange={(val) => updateFilter('fuelType', val === 'all' ? null : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={dict.cars.allFuelTypes || "All Fuel Types"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dict.cars.allFuelTypes || "All Fuel Types"}</SelectItem>
              {Object.entries(FUEL_TYPE_LABELS[lang]).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label>{dict.cars.sortBy}</Label>
          <Select
            value={searchParams.get('sort') || 'default'}
            onValueChange={(val) => updateFilter('sort', val === 'default' ? null : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={dict.cars.sortBy} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{dict.cars.sortBy}</SelectItem>
              <SelectItem value="price_asc">{dict.cars.sortPrice} ({dict.cars.ascending})</SelectItem>
              <SelectItem value="price_desc">{dict.cars.sortPrice} ({dict.cars.descending})</SelectItem>
              <SelectItem value="year_desc">{dict.cars.sortYear} ({dict.cars.descending})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
