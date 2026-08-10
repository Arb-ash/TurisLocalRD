import { prisma } from '@/lib/db';
import ExperienceCard from '@/components/ExperienceCard';
import SearchFilters from '@/components/SearchFilters';
import { Compass, Sparkles, MapPin, Map, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '';
  const city = typeof resolvedSearchParams.city === 'string' ? resolvedSearchParams.city : '';
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : '';
  const priceRange = typeof resolvedSearchParams.priceRange === 'string' ? resolvedSearchParams.priceRange : '';
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'rating';

  // Build the dynamic where clause for Prisma
  const whereClause: any = {
    AND: [
      q
        ? {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { guideName: { contains: q } },
          ],
        }
        : {},
      city && city !== 'Todos'
        ? {
          city: {
            equals: city,
          },
        }
        : {},
      category && category !== 'Todos'
        ? {
          category: {
            equals: category,
          },
        }
        : {},
    ],
  };

  // Add price range query filters
  if (priceRange && priceRange !== 'Todos') {
    if (priceRange === 'budget') {
      whereClause.AND.push({
        price: {
          lt: 30,
        },
      });
    } else if (priceRange === 'mid') {
      whereClause.AND.push({
        price: {
          gte: 30,
          lte: 50,
        },
      });
    } else if (priceRange === 'premium') {
      whereClause.AND.push({
        price: {
          gt: 50,
        },
      });
    }
  }

  // Set order by clause based on sort parameter
  let orderByClause: any = { rating: 'desc' };
  if (sort === 'priceAsc') {
    orderByClause = { price: 'asc' };
  } else if (sort === 'priceDesc') {
    orderByClause = { price: 'desc' };
  } else if (sort === 'rating') {
    orderByClause = { rating: 'desc' };
  }

  // Query database with filters
  const experiences = await prisma.experience.findMany({
    where: whereClause,
    orderBy: orderByClause,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-12 pb-20 lg:pt-24 lg:pb-32 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Turismo Auténtico y Sostenible
              </span>

              <h1 className="font-serif text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-foreground leading-[1.1]">
                Descubre la esencia <span className="text-primary italic font-normal">Dominicana</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg text-muted md:text-xl font-light">
                Rutas históricas, gastronomía tradicional y joyas ecológicas ocultas. Vive experiencias únicas diseñadas por quienes mejor conocen su tierra.
              </p>

              {/* Mobile Search Widget (visible on small screens) */}
              <div className="mt-10 lg:hidden w-full rounded-3xl bg-card border border-border p-5 shadow-xl relative z-20">
                <SearchFilters />
              </div>
            </div>

            {/* Image & Desktop Search Widget */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-stone-900 bg-muted-light">
                <img
                  src="/hero-image.png"
                  alt="Turismo local en República Dominicana"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Desktop Floating Widget */}
              <div className="hidden lg:block absolute -left-16 -bottom-10 right-10 z-30">
                <div className="rounded-3xl glass-effect border border-border p-6 shadow-2xl bg-white/95 dark:bg-card/95">
                  <SearchFilters />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Content */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 flex items-center gap-2">
              <Compass className="h-7 w-7 text-primary" />
              Experiencias Disponibles
            </h2>
            <p className="mt-2 text-sm text-muted">
              {experiences.length === 0
                ? 'No se encontraron resultados para tu búsqueda'
                : `Mostrando ${experiences.length} ${experiences.length === 1 ? 'experiencia única' : 'experiencias únicas'
                }`}
            </p>
          </div>

          {/* Location indicator */}
          {((city && city !== 'Todos') || q || (category && category !== 'Todos') || (priceRange && priceRange !== 'Todos') || (sort && sort !== 'rating')) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">Filtros activos:</span>
              {city && city !== 'Todos' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <MapPin className="h-3 w-3" />
                  {city}
                </span>
              )}
              {q && (
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-500/10 px-3 py-1 text-xs font-semibold text-stone-600 dark:text-stone-300">
                  &ldquo;{q}&rdquo;
                </span>
              )}
              {category && category !== 'Todos' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
                  {category}
                </span>
              )}
              {priceRange && priceRange !== 'Todos' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {priceRange === 'budget' ? 'Económico (< $30)' : priceRange === 'mid' ? 'Moderado ($30 - $50)' : 'Premium (> $50)'}
                </span>
              )}
              {sort && sort !== 'rating' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {sort === 'priceAsc' ? 'Precio: Menor a Mayor' : 'Precio: Mayor a Menor'}
                </span>
              )}
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-foreground transition-colors ml-2"
              >
                <RefreshCw className="h-3 w-3" />
                Limpiar todo
              </Link>
            </div>
          )}
        </div>

        {/* Catalog Grid */}
        {experiences.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 fade-in-up">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={index === 0 ? "md:col-span-2" : ""}
              >
                <ExperienceCard exp={exp} featured={index === 0} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center max-w-xl mx-auto shadow-sm my-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted-light text-muted">
              <Map className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-stone-900 dark:text-stone-50">
              No encontramos experiencias
            </h3>
            <p className="mt-2 text-sm text-muted">
              Intenta cambiar los términos de búsqueda o selecciona otra ciudad para descubrir más aventuras.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-md transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Restaurar filtros
            </Link>
          </div>
        )}
      </section>

      {/* How it works section */}
      <section id="como-funciona" className="bg-muted-light border-y border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              ¿Cómo funciona TurisLocalRD?
            </h2>
            <p className="mt-3 text-sm text-muted">
              Tres simples pasos para vivir una aventura inolvidable y apoyar a las comunidades locales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-foreground">Elige tu experiencia</h3>
              <p className="mt-2 text-sm text-muted">
                Explora nuestro catálogo curado de tours gastronómicos, rutas históricas y senderos ecológicos.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-foreground">Reserva al instante</h3>
              <p className="mt-2 text-sm text-muted">
                Elige la cantidad de personas y reserva tu cupo ingresando tus datos básicos de forma rápida y segura.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-foreground">Disfruta con un guía</h3>
              <p className="mt-2 text-sm text-muted">
                Reúnete con tu guía local autorizado y sumérgete en una aventura auténtica llena de historias reales.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
