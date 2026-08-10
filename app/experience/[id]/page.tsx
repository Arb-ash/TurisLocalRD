import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BookingForm from '@/components/BookingForm';
import { getSession } from '@/lib/auth';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Star, 
  User, 
  Check, 
  ShieldCheck, 
  Leaf, 
  CalendarDays,
  Ticket
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const experienceId = parseInt(id, 10);
  const session = await getSession();

  if (isNaN(experienceId)) {
    notFound();
  }

  // Fetch the experience from database
  const exp = await prisma.experience.findUnique({
    where: { id: experienceId },
  });

  if (!exp) {
    notFound();
  }

  const isSoldOut = exp.availableSlots <= 0;

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950/20 pb-20">
      {/* Navigation Breadcrumb & Back button */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-stone-50 shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeft className="h-4 w-4 text-primary" />
          Volver al catálogo
        </Link>
      </div>

      {/* Main Experience Layout Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Images */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Title */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  <MapPin className="h-3.5 w-3.5" />
                  {exp.city}
                </span>
                
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {exp.rating.toFixed(1)} (Calificación)
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 dark:bg-stone-900 px-3 py-1 text-xs font-bold text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  {exp.duration}
                </span>
              </div>
              
              <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
                {exp.title}
              </h1>
            </div>

            {/* Experience Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border shadow-md bg-muted-light">
              <Image
                src={exp.imageUrl}
                alt={exp.title}
                fill
                priority
                className="object-cover object-center"
              />
            </div>

            {/* Guide Info Banner */}
            <div className="flex items-center gap-4 rounded-2xl bg-card border border-border p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                {exp.guideName.charAt(0)}
              </div>
              <div>
                <span className="text-xs text-muted block">Tu guía local experto</span>
                <span className="font-bold text-stone-900 dark:text-stone-50 text-base">{exp.guideName}</span>
              </div>
              <div className="ml-auto hidden sm:flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20">
                <ShieldCheck className="h-4 w-4" />
                Guía Certificado
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">
                Acerca de esta experiencia
              </h2>
              <p className="text-stone-700 dark:text-stone-300 text-base leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>
            </div>

            {/* Included highlights */}
            <div className="rounded-2xl bg-muted-light border border-border p-6 space-y-4">
              <h3 className="font-bold text-stone-900 dark:text-stone-50 text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                ¿Qué incluye la experiencia?
              </h3>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-700 dark:text-stone-300">
                <li className="flex items-center gap-2.5">
                  <div className="rounded-full bg-emerald-500/10 p-0.5 text-emerald-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Guía local bilingüe acreditado</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="rounded-full bg-emerald-500/10 p-0.5 text-emerald-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Degustaciones indicadas en la ruta</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="rounded-full bg-emerald-500/10 p-0.5 text-emerald-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Hidratación básica</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="rounded-full bg-emerald-500/10 p-0.5 text-emerald-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Seguro de accidentes básico</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Quick Info Box */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted block leading-none">Precio total</span>
                  <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-50 mt-1 block">
                    ${exp.price.toFixed(2)}
                    <span className="text-sm font-normal text-muted"> / pers</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-muted block leading-none">Disponibilidad</span>
                  {isSoldOut ? (
                    <span className="inline-flex rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-bold text-red-600 mt-1">
                      Agotado
                    </span>
                  ) : exp.availableSlots <= 3 ? (
                    <span className="inline-flex rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 mt-1 animate-pulse">
                      ¡Solo {exp.availableSlots} cupos!
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 mt-1">
                      {exp.availableSlots} cupos
                    </span>
                  )}
                </div>
              </div>

              {/* Booking Form Widget */}
              <BookingForm 
                experienceId={exp.id}
                experienceTitle={exp.title}
                availableSlots={exp.availableSlots}
                price={exp.price}
                session={session}
              />
              
              {/* Trust Badge info */}
              <div className="flex gap-3 text-xs text-muted px-2">
                <CalendarDays className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p>
                  <strong>Reserva flexible:</strong> Puedes cancelar de forma gratuita hasta 24 horas antes del inicio de la experiencia.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
