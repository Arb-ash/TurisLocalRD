'use client';

import { cancelReservationAction } from '@/app/actions';
import { useActionState, useState, useEffect } from 'react';
import { Trash2, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface CancelReservationButtonProps {
  reservationId: number;
  experienceTitle: string;
}

export default function CancelReservationButton({
  reservationId,
  experienceTitle,
}: CancelReservationButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, formAction, isPending] = useActionState(cancelReservationAction, null);

  useEffect(() => {
    if (state?.success) {
      setShowConfirm(false);
    }
  }, [state]);

  if (state?.success) {
    return (
      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
        <CheckCircle className="h-3.5 w-3.5" />
        Reserva Cancelada
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 p-2.5 rounded-2xl w-full sm:w-auto animate-fade-in">
        <div className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse text-red-500" />
          <span>¿Seguro que deseas cancelar?</span>
        </div>
        
        <div className="flex items-center gap-1.5 justify-end mt-1.5 sm:mt-0">
          <form action={formAction}>
            <input type="hidden" name="reservationId" value={reservationId} />
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1 rounded-xl bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm hover:shadow active:scale-98 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Cancelando...</span>
                </>
              ) : (
                <span>Sí, cancelar</span>
              )}
            </button>
          </form>
          
          <button
            type="button"
            disabled={isPending}
            onClick={() => setShowConfirm(false)}
            className="rounded-xl border border-border bg-card hover:bg-muted-light text-stone-700 dark:text-stone-300 px-3.5 py-1.5 text-xs font-bold transition-all active:scale-98 disabled:pointer-events-none"
          >
            No
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-1.5 rounded-xl border border-red-200 hover:border-red-600 bg-red-50/20 dark:bg-red-950/10 hover:bg-red-600 text-red-600 hover:text-white px-4 py-2 text-xs font-bold transition-all shadow-sm cursor-pointer"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Cancelar Reserva
      </button>
      {state?.message && !state.success && (
        <span className="text-[10px] text-red-600 font-semibold max-w-xs text-right">
          {state.message}
        </span>
      )}
    </div>
  );
}
