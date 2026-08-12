import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';

export default async function DemoLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function loginAction(formData: FormData) {
    'use server';
    const username = formData.get('username');
    const password = formData.get('password');

    if (username === 'Maestra' && password === 'cooldown23') {
      const cookieStore = await cookies();
      cookieStore.set('demo_unlocked', 'true', {
        maxAge: 60 * 60 * 24, // 1 día
        httpOnly: true,
        path: '/',
      });
      redirect('/');
    } else {
      redirect('/demo-login?error=1');
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 rounded-3xl shadow-xl">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-md mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-stone-50">
            Acceso al Demo
          </h2>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Ingresa las credenciales maestras para evaluar la plataforma.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-600 text-center font-medium">
            Credenciales incorrectas. Intenta de nuevo.
          </div>
        )}

        <form action={loginAction} className="mt-8 space-y-5">
          <div>
            <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Ej. Maestra"
              className="mt-1.5 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 transition-all text-stone-900 dark:text-stone-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 transition-all text-stone-900 dark:text-stone-50"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 dark:bg-stone-100 py-3 text-sm font-semibold text-white dark:text-stone-900 hover:opacity-90 shadow-md transition-all"
          >
            <span>Desbloquear Demo</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
