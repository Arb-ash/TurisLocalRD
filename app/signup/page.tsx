'use client';

import { useActionState } from 'react';
import { signupAction, AuthState } from '@/app/actions/authActions';
import Link from 'next/link';
import { Compass, User, Mail, Lock, ShieldCheck, ArrowRight, UserCircle2 } from 'lucide-react';

const initialState: AuthState = null;

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-card border border-border p-8 rounded-3xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20 mb-4">
            <Compass className="h-6 w-6" />
          </Link>
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-stone-50">
            Crear una cuenta
          </h2>
          <p className="mt-2 text-sm text-muted">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Inicia sesión aquí
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
          
          {/* Role selection */}
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Tipo de Perfil
            </span>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-4 text-center cursor-pointer hover:bg-stone-50/50 [&:has(input:checked)]:border-primary [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-primary transition-all">
                <input
                  type="radio"
                  name="role"
                  value="TOURIST"
                  defaultChecked
                  className="absolute right-3 top-3 accent-primary"
                />
                <User className="h-5 w-5 text-stone-600 dark:text-stone-400 mb-1" />
                <span className="text-sm font-bold text-stone-900 dark:text-stone-50">Turista</span>
                <span className="text-xxs text-muted mt-1 leading-tight">Quiero reservar tours</span>
              </label>

              <label className="relative flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-4 text-center cursor-pointer hover:bg-stone-50/50 [&:has(input:checked)]:border-primary [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-primary transition-all">
                <input
                  type="radio"
                  name="role"
                  value="GUIDE"
                  className="absolute right-3 top-3 accent-primary"
                />
                <ShieldCheck className="h-5 w-5 text-stone-600 dark:text-stone-400 mb-1" />
                <span className="text-sm font-bold text-stone-900 dark:text-stone-50">Guía Local</span>
                <span className="text-xxs text-muted mt-1 leading-tight">Quiero guiar experiencias</span>
              </label>
            </div>
            {state?.errors?.role && (
              <p className="mt-1 text-xs text-red-600">{state.errors.role[0]}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted">
              Nombre Completo
            </label>
            <div className="relative mt-1.5 flex items-center">
              <div className="pointer-events-none absolute left-3 text-muted">
                <UserCircle2 className="h-4 w-4" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Ej. Juan Pérez"
                className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                  state?.errors?.name ? 'border-red-500 focus-visible:ring-red-500' : 'border-border'
                }`}
              />
            </div>
            {state?.errors?.name && (
              <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>
            )}
          </div>

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
                placeholder="Mínimo 6 caracteres"
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
                <span>Creando cuenta...</span>
              </>
            ) : (
              <>
                <span>Registrarse</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
