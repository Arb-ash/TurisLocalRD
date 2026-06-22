import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, DollarSign, Compass, ArrowLeft, Ticket } from 'lucide-react';
import CancelReservationButton from '@/components/CancelReservationButton';

export default async function ReservationsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch the reservations linked to the current logged-in user
  const reservations = await prisma.reservation.findMany({
    where: {
      userId: session.userId,
    },
    include: {
      experience: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950/20 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a explorar
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-50 flex items-center gap-2">
              <Ticket className="h-7 w-7 text-primary" />
              Mis Reservas
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Hola, {session.name}. Aquí tienes un listado de tus aventuras reservadas.
            </p>
          </div>
          
          <div className="rounded-2xl bg-card border border-border px-4 py-2 shadow-sm text-xs font-semibold text-muted flex items-center gap-1.5 self-start">
            Rol de Cuenta: <span className="text-primary uppercase">{session.role === 'TOURIST' ? 'Turista' : 'Guía Local'}</span>
          </div>
        </div>

        {/* List of Reservations */}
        {reservations.length > 0 ? (
          <div className="space-y-6 fade-in-up">
            {reservations.map((res) => {
              const exp = res.experience;
              const dateString = new Date(res.createdAt).toLocaleDateString('es-DO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <div
                  key={res.id}
                  className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow transition-all duration-300 grid grid-cols-1 md:grid-cols-4"
                >
                  {/* Left Column: Image (Desktop) */}
                  <div className="relative aspect-video md:aspect-auto w-full md:h-full min-h-[140px] bg-muted-light">
                    <Image
                      src={exp.imageUrl}
                      alt={exp.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Right Column: Ticket details (3 cols on desktop) */}
                  <div className="md:col-span-3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xxs font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
                          Reserva #{res.id}
                        </span>
                        
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {dateString}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-foreground">
                        <Link href={`/experience/${exp.id}`} className="hover:text-primary transition-colors">
                          {exp.title}
                        </Link>
                      </h3>
                      
                      <p className="mt-1 text-xs text-muted">
                        Ciudad: <span className="font-semibold text-stone-700 dark:text-stone-300">{exp.city}</span> | Guía: <span className="font-semibold text-stone-700 dark:text-stone-300">{exp.guideName}</span>
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
                      {/* Stats */}
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-sm text-stone-700 dark:text-stone-300">
                          <Users className="h-4 w-4 text-muted" />
                          <span>
                            {res.peopleCount} {res.peopleCount === 1 ? 'Persona' : 'Personas'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold text-stone-900 dark:text-stone-50">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span>${(res.peopleCount * exp.price).toFixed(2)} USD</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/experience/${exp.id}`}
                          className="rounded-xl border border-border hover:border-primary hover:bg-primary/5 px-4 py-2 text-xs font-bold text-stone-700 hover:text-primary dark:text-stone-300 transition-all shadow-sm"
                        >
                          Ver detalles
                        </Link>
                        <CancelReservationButton reservationId={res.id} experienceTitle={exp.title} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted-light text-muted">
              <Compass className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-stone-900 dark:text-stone-50">
              Aún no tienes reservas
            </h3>
            <p className="mt-2 text-sm text-muted">
              Comienza a explorar los fascinantes rincones de la República Dominicana y agenda tu primera experiencia.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-md transition-all"
            >
              Explorar Experiencias
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
