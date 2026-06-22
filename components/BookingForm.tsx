'use client';

import { useActionState, useEffect, useState } from 'react';
import { createReservation, ActionState } from '@/app/actions';
import { AlertCircle, CheckCircle2, Ticket, Users, Mail, User, ArrowRight, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface BookingFormProps {
  experienceId: number;
  experienceTitle: string;
  availableSlots: number;
  session: any;
}

const initialState: ActionState = null;

export default function BookingForm({
  experienceId,
  experienceTitle,
  availableSlots,
  session,
}: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(createReservation, initialState);
  const [peopleCount, setPeopleCount] = useState(1);

  // Trigger confetti on success
  useEffect(() => {
    if (state?.success) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0f766e', '#d97706', '#14b8a6', '#f59e0b'],
      });
    }
  }, [state]);

  const isSoldOut = availableSlots <= 0;

  // Render Success Confirmation
  if (state?.success && state.data) {
    const { reservationId, customerName, peopleCount: count } = state.data;
    return (
      <div className="rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8 text-center shadow-lg fade-in-up">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        
        <h3 className="mt-4 text-xl font-extrabold text-stone-900 dark:text-stone-50">
          ¡Reserva Confirmada!
        </h3>
        
        <p className="mt-2 text-sm text-muted">
          Tu boleto ha sido guardado con éxito. Hemos enviado un correo de confirmación.
        </p>

        {/* Ticket Details */}
        <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-5 text-left shadow-sm">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Boleto TurisLocalRD</span>
            <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              #{reservationId}
            </span>
          </div>

          <div className="space-y-3 pt-3 text-sm">
            <div>
              <span className="text-xs text-muted block">Experiencia</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">{experienceTitle}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted block">Titular</span>
                <span className="font-semibold text-stone-950 dark:text-stone-50 truncate block">{customerName}</span>
              </div>
              <div>
                <span className="text-xs text-muted block">Viajeros</span>
                <span className="font-semibold text-stone-950 dark:text-stone-50">{count} {count === 1 ? 'persona' : 'personas'}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm hover:shadow transition-all"
        >
          <Compass className="h-4 w-4" />
          Explorar más experiencias
        </button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-md text-center">
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 flex items-center justify-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          Reservar Experiencia
        </h3>
        <p className="mt-3 text-xs text-muted leading-relaxed">
          Inicia sesión o regístrate para reservar esta experiencia de forma rápida y llevar un control de tus reservas.
        </p>
        <Link
          href="/login"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-md hover:shadow shadow-primary/20 transition-all"
        >
          <span>Iniciar Sesión para Reservar</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
      <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
        <Ticket className="h-5 w-5 text-primary" />
        Reservar esta Experiencia
      </h3>
      
      <p className="mt-1.5 text-xs text-muted">
        Estás reservando como <span className="font-semibold text-stone-950 dark:text-stone-50">{session.name}</span>.
      </p>

      {/* General Alert Message */}
      {state?.message && !state.success && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 border border-red-500/20">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        {/* Hidden inputs to pass data to Server Action */}
        <input type="hidden" name="experienceId" value={experienceId} />

        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-xs font-semibold uppercase tracking-wider text-muted">
            Nombre Completo
          </label>
          <div className="relative mt-1.5 flex items-center">
            <div className="pointer-events-none absolute left-3 text-muted">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={session.name}
              readOnly
              required
              className="w-full rounded-xl border border-border bg-stone-100 dark:bg-stone-900/50 py-2.5 pl-10 pr-4 text-sm text-stone-500 dark:text-stone-400 cursor-not-allowed outline-none"
            />
          </div>
          {state?.errors?.customerName && (
            <p className="mt-1 text-xs text-red-600 font-medium">{state.errors.customerName[0]}</p>
          )}
        </div>

        {/* Customer Email */}
        <div>
          <label htmlFor="customerEmail" className="block text-xs font-semibold uppercase tracking-wider text-muted">
            Correo Electrónico
          </label>
          <div className="relative mt-1.5 flex items-center">
            <div className="pointer-events-none absolute left-3 text-muted">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={session.email}
              readOnly
              required
              className="w-full rounded-xl border border-border bg-stone-100 dark:bg-stone-900/50 py-2.5 pl-10 pr-4 text-sm text-stone-500 dark:text-stone-400 cursor-not-allowed outline-none"
            />
          </div>
          {state?.errors?.customerEmail && (
            <p className="mt-1 text-xs text-red-600 font-medium">{state.errors.customerEmail[0]}</p>
          )}
        </div>

        {/* People Count selector */}
        <div>
          <label htmlFor="peopleCount" className="block text-xs font-semibold uppercase tracking-wider text-muted">
            Cantidad de Personas
          </label>
          <div className="relative mt-1.5 flex items-center">
            <div className="pointer-events-none absolute left-3 text-muted">
              <Users className="h-4 w-4" />
            </div>
            
            <select
              id="peopleCount"
              name="peopleCount"
              value={peopleCount}
              onChange={(e) => setPeopleCount(Number(e.target.value))}
              disabled={isSoldOut || isPending}
              className={`w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all`}
            >
              {Array.from({ length: Math.max(1, Math.min(10, availableSlots)) }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? 'Persona' : 'Personas'}
                </option>
              ))}
            </select>
          </div>
          {state?.errors?.peopleCount && (
            <p className="mt-1 text-xs text-red-600 font-medium">{state.errors.peopleCount[0]}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSoldOut || isPending}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-98 transition-all disabled:pointer-events-none disabled:bg-muted disabled:shadow-none"
        >
          {isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Procesando Reserva...</span>
            </>
          ) : isSoldOut ? (
            <span>Agotado</span>
          ) : (
            <>
              <span>Reservar Experiencia</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
