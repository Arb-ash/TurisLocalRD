'use client';

import { useActionState } from 'react';
import { loginAction, AuthState } from '@/app/actions/authActions';
import Link from 'next/link';
import { Compass, Mail, Lock, ArrowRight } from 'lucide-react';

const initialState: AuthState = null;

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-card border border-border p-8 rounded-3xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20 mb-4">
            <Compass className="h-6 w-6" />
          </Link>
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-stone-50">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-muted">
            ¿No tienes cuenta?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Global Error Banner */}
        {state?.message && !state.success && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-600">
            {state.message}
          </div>
        )}

        <form action={formAction} className="mt-8 space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted">
              Correo Electrónico
            </label>
            <div className="relative mt-1.5 flex items-center">
              <div className="pointer-events-none absolute left-3 text-muted">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="juan@email.com"
                className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                  state?.errors?.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-border'
                }`}
              />
            </div>
            {state?.errors?.email && (
              <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-muted">
              Contraseña
            </label>
            <div className="relative mt-1.5 flex items-center">
              <div className="pointer-events-none absolute left-3 text-muted">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Ingresa tu contraseña"
                className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                  state?.errors?.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-border'
                }`}
              />
            </div>
            {state?.errors?.password && (
              <p className="mt-1 text-xs text-red-600">{state.errors.password[0]}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span>Ingresar</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
