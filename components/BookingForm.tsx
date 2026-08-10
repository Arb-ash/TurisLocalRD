'use client';

import { useActionState, useEffect, useState } from 'react';
import { createReservation, ActionState } from '@/app/actions';
import { AlertCircle, CheckCircle2, Ticket, ArrowRight, Compass, ShieldCheck, User, Minus, Plus, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface BookingFormProps {
  experienceId: number;
  experienceTitle: string;
  availableSlots: number;
  price: number;
  session: any;
}

const initialState: ActionState = null;

export default function BookingForm({
  experienceId,
  experienceTitle,
  availableSlots,
  price,
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
        colors: ['#0f766e', '#fb7185', '#14b8a6', '#f43f5e'],
      });
    }
  }, [state]);

  const isSoldOut = availableSlots <= 0;
  const totalPrice = price * peopleCount;

  // Render Success Confirmation
  if (state?.success && state.data) {
    const { reservationId, customerName, peopleCount: count } = state.data;
    const finalPrice = price * count;

    return (
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 text-center shadow-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h3 className="text-2xl font-extrabold text-foreground">
          ¡Reserva Confirmada!
        </h3>

        <p className="mt-2 text-sm text-muted">
          Tu boleto ha sido generado con éxito. Hemos enviado un correo a <span className="font-semibold text-foreground">{session.email}</span>.
        </p>

        {/* Ticket Details */}
        <div className="mt-8 w-full relative">
          <div className="rounded-2xl bg-muted-light/50 border border-border p-6 text-left relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-foreground uppercase tracking-wider">Pase de Abordaje</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">
                #{reservationId}
              </span>
            </div>

            <div className="space-y-4 relative z-10">
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Experiencia</span>
                <span className="font-bold text-foreground text-base">{experienceTitle}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Viajero</span>
                  <span className="font-bold text-foreground truncate block">{customerName}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Total Viajeros</span>
                  <span className="font-bold text-foreground">{count} {count === 1 ? 'persona' : 'personas'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/80 flex justify-between items-end">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Monto Pagado</span>
                <span className="font-extrabold text-foreground text-xl">${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-4 md:py-5 text-base font-bold text-white hover:bg-primary-hover active:scale-[0.98] transition-all w-full justify-center"
        >
          <Compass className="h-5 w-5" />
          Descubrir más experiencias
        </button>
      </div>
    );
  }

  // Not logged in state
  if (!session) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm text-center flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
          <Ticket className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">
          Reserva esta Experiencia
        </h3>
        <p className="text-sm text-muted leading-relaxed max-w-sm">
          Inicia sesión o regístrate para asegurar tu lugar de forma rápida.
        </p>
        <Link
          href="/login"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 md:py-5 text-base font-bold text-white hover:bg-primary-hover active:scale-[0.98] transition-all"
        >
          <span>Iniciar Sesión para Reservar</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary shrink-0" />
          Reserva tu lugar
        </h3>

        {/* Availability Badge */}
        {isSoldOut ? (
          <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 self-start sm:self-auto border border-red-100">
            Agotado
          </span>
        ) : (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold self-start sm:self-auto ${
            availableSlots <= 3
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-primary/10 text-primary border border-primary/20'
          }`}>
            {availableSlots <= 3 && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
            {availableSlots} {availableSlots === 1 ? 'cupo libre' : 'cupos libres'}
          </span>
        )}
      </div>

      {/* General Alert Message */}
      {state?.message && !state.success && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-bold">No pudimos procesar tu reserva</span>
            <span className="opacity-90 mt-0.5">{state.message}</span>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="experienceId" value={experienceId} />
        {/* Required for backend action without editable inputs */}
        <input type="hidden" name="customerName" value={session.name} />
        <input type="hidden" name="customerEmail" value={session.email} />

        {/* User Info Summary (Reduced Mental Load) */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Datos del viajero principal</p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm text-foreground truncate">{session.name}</span>
              <span className="text-xs text-muted truncate">{session.email}</span>
            </div>
          </div>
        </div>

        {/* People Count Stepper */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-3">
            ¿Cuántas personas van?
          </label>
          <div className="flex items-center justify-between rounded-2xl border border-border p-2 bg-muted-light/30">
            <button
              type="button"
              disabled={peopleCount <= 1 || isSoldOut || isPending}
              onClick={() => setPeopleCount(p => Math.max(1, p - 1))}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted-light active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all shadow-sm"
              aria-label="Reducir cantidad de personas"
            >
              <Minus className="h-5 w-5" />
            </button>
            
            <div className="flex flex-col items-center">
              <span className="text-xl font-extrabold text-foreground leading-none">{peopleCount}</span>
              <span className="text-xs font-medium text-muted mt-1">{peopleCount === 1 ? 'Viajero' : 'Viajeros'}</span>
            </div>
            
            <button
              type="button"
              disabled={peopleCount >= Math.min(10, availableSlots) || isSoldOut || isPending}
              onClick={() => setPeopleCount(p => Math.min(10, availableSlots, p + 1))}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted-light active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all shadow-sm"
              aria-label="Aumentar cantidad de personas"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <input type="hidden" name="peopleCount" value={peopleCount} />
          {state?.errors?.peopleCount && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600 font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              {state.errors.peopleCount[0]}
            </p>
          )}
        </div>

        {/* Total Price & Submit Button Section */}
        <div className="pt-6 border-t border-border mt-6">
          <div className="flex justify-between items-end mb-6">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Total a pagar</span>
              <span className="text-xs text-muted flex items-center gap-1 mt-1">
                <Info className="h-3 w-3" /> Impuestos incluidos
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-foreground leading-none">
                ${totalPrice.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-muted mt-2">
                ${price.toFixed(2)} x {peopleCount} {peopleCount === 1 ? 'persona' : 'personas'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSoldOut || isPending}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-4 md:py-5 text-lg font-bold text-white hover:bg-secondary-hover shadow-[0_8px_20px_-6px_rgba(251,113,133,0.5)] active:scale-[0.98] transition-all disabled:pointer-events-none disabled:bg-muted disabled:shadow-none"
          >
            {isPending ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                <span>Confirmando...</span>
              </>
            ) : isSoldOut ? (
              <span>Experiencia Agotada</span>
            ) : (
              <>
                <ShieldCheck className="h-6 w-6" />
                <span>Confirmar Reserva</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

