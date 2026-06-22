'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  X, 
  Globe, 
  UtensilsCrossed, 
  Landmark, 
  Trees, 
  Palmtree, 
  ArrowUpDown, 
  DollarSign 
} from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

const CITIES = ['Todos', 'Santo Domingo', 'Santiago', 'Samaná', 'Punta Cana', 'Puerto Plata', 'La Romana'];

const CATEGORIES = [
  { name: 'Todos', icon: Globe },
  { name: 'Gastronomía', icon: UtensilsCrossed },
  { name: 'Historia', icon: Landmark },
  { name: 'Naturaleza', icon: Trees },
  { name: 'Playa', icon: Palmtree },
];

const PRICE_RANGES = [
  { value: 'Todos', label: 'Cualquier precio' },
  { value: 'budget', label: 'Económico (< $30)' },
  { value: 'mid', label: 'Moderado ($30 - $50)' },
  { value: 'premium', label: 'Premium (> $50)' },
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Más valorados ⭐' },
  { value: 'priceAsc', label: 'Precio: de menor a mayor' },
  { value: 'priceDesc', label: 'Precio: de mayor a menor' },
];

export default function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local states synced from URL searchParams
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const activeCity = searchParams.get('city') || 'Todos';
  const activeCategory = searchParams.get('category') || 'Todos';
  const activePriceRange = searchParams.get('priceRange') || 'Todos';
  const activeSort = searchParams.get('sort') || 'rating';

  // Sync search input if URL changes externally
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  // Main navigation update trigger
  const updateQuery = (filters: {
    q?: string;
    city?: string;
    category?: string;
    priceRange?: string;
    sort?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Evaluate search text
    const searchVal = filters.q !== undefined ? filters.q : search;
    if (searchVal.trim()) {
      params.set('q', searchVal.trim());
    } else {
      params.delete('q');
    }

    // Evaluate city
    const cityVal = filters.city !== undefined ? filters.city : activeCity;
    if (cityVal && cityVal !== 'Todos') {
      params.set('city', cityVal);
    } else {
      params.delete('city');
    }

    // Evaluate category
    const catVal = filters.category !== undefined ? filters.category : activeCategory;
    if (catVal && catVal !== 'Todos') {
      params.set('category', catVal);
    } else {
      params.delete('category');
    }

    // Evaluate price range
    const priceVal = filters.priceRange !== undefined ? filters.priceRange : activePriceRange;
    if (priceVal && priceVal !== 'Todos') {
      params.set('priceRange', priceVal);
    } else {
      params.delete('priceRange');
    }

    // Evaluate sorting
    const sortVal = filters.sort !== undefined ? filters.sort : activeSort;
    if (sortVal && sortVal !== 'rating') {
      params.set('sort', sortVal);
    } else {
      params.delete('sort');
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ q: search });
  };

  const handleClearAll = () => {
    setSearch('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      
      {/* Category Tabs (Airbnb style) */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-none gap-6 border-b border-border/40">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => updateQuery({ category: cat.name })}
              className={`flex flex-col items-center gap-1.5 py-1 border-b-2 transition-all cursor-pointer whitespace-nowrap min-w-[70px] ${
                isActive
                  ? 'border-primary text-primary font-bold scale-102'
                  : 'border-transparent text-stone-300 hover:text-white hover:border-stone-300'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-stone-400'}`} />
              <span className="text-xs">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 text-stone-500">
          <Search className="h-5 w-5" />
        </div>
        
        <input
          type="text"
          placeholder="Buscar tours gastronómicos, paseos históricos o guías locales..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-12 text-base text-stone-950 dark:text-stone-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all placeholder:text-stone-500"
        />

        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              updateQuery({ q: '' });
            }}
            className="absolute right-4 p-1 rounded-full hover:bg-muted-light text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Dropdown Filters and Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Price Range Selector */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="priceRange" className="text-xs font-bold uppercase tracking-wider text-stone-200 dark:text-stone-300 flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
            Rango de Precio
          </label>
          <select
            id="priceRange"
            value={activePriceRange}
            onChange={(e) => updateQuery({ priceRange: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-stone-950 dark:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all cursor-pointer"
          >
            {PRICE_RANGES.map((range) => (
              <option key={range.value} value={range.value} className="text-stone-950 bg-white">
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sort" className="text-xs font-bold uppercase tracking-wider text-stone-200 dark:text-stone-300 flex items-center gap-1">
            <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
            Ordenar por
          </label>
          <select
            id="sort"
            value={activeSort}
            onChange={(e) => updateQuery({ sort: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-stone-950 dark:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-stone-950 bg-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* City Badges (with Loader) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-200 dark:text-stone-300 flex items-center gap-1 px-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Provincias / Destinos
          </span>
          {isPending && (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border border-primary border-t-transparent"></div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => {
            const isActive = activeCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => updateQuery({ city })}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white scale-102 shadow-primary/10'
                    : 'bg-card border border-border text-foreground hover:bg-muted-light'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Global reset button when filters are active */}
      {(searchParams.toString() && searchParams.toString() !== 'sort=rating') && (
        <button
          onClick={handleClearAll}
          className="text-xs font-bold text-muted hover:text-stone-950 dark:hover:text-stone-50 transition-colors self-center flex items-center gap-1 mt-2 hover:underline"
        >
          Limpiar todos los filtros
        </button>
      )}
    </div>
  );
}
