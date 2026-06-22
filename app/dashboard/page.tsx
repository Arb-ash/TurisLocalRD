import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import GuideDashboardClient from '@/components/GuideDashboardClient';
import { ShieldCheck, Compass, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel de Control del Guía | TurisLocalRD',
  description: 'Gestiona tus tours, visualiza las reservas de tus turistas y analiza tus ingresos en la plataforma.',
};

export default async function DashboardPage() {
  const session = await getSession();

  // 1. Guard Clauses: Auth & Roles
  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'GUIDE') {
    redirect('/reservations');
  }

  // 2. Database lookups
  // Fetch experiences owned by the logged-in guide
  const experiences = await prisma.experience.findMany({
    where: {
      guideId: session.userId,
    },
    include: {
      reservations: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  // Fetch reservations made for the guide's experiences
  const reservations = await prisma.reservation.findMany({
    where: {
      experience: {
        guideId: session.userId,
      },
    },
    include: {
      experience: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Since prisma returns standard Date objects, serialization is handled by Next.js RSC.
  // SQLite mappings are fully compatible.

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950/20 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
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

        {/* Dashboard Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary" />
              Panel de Control del Guía
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Bienvenido, {session.name}. Administra tus experiencias publicadas y realiza un seguimiento de tus reservas.
            </p>
          </div>
          
          <div className="rounded-2xl bg-card border border-border px-4 py-2 shadow-sm text-xs font-semibold text-muted flex items-center gap-1.5 self-start">
            Correo: <span className="text-stone-900 dark:text-stone-100 font-bold">{session.email}</span>
          </div>
        </div>

        {/* Client-side Dashboard wrapper (renders tabs, stats, and tour creation form) */}
        <GuideDashboardClient
          session={session}
          experiences={experiences}
          reservations={reservations}
        />

      </div>
    </div>
  );
}
