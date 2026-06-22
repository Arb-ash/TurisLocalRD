import Link from 'next/link';
import { Compass, Globe, LogOut, ShieldCheck, Ticket, User, UserPlus } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { logoutAction } from '@/app/actions/authActions';

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition-all group-hover:scale-105">
            <Compass className="h-5 w-5 animate-spin-slow" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground transition-all group-hover:text-primary">
            TurisLocal<span className="text-primary">RD</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Explorar
          </Link>
          {session ? (
            session.role === 'GUIDE' ? (
              <Link href="/dashboard" className="text-sm font-semibold text-stone-850 hover:text-primary transition-colors flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary animate-pulse" />
                Panel de Guía
              </Link>
            ) : (
              <Link href="/reservations" className="text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-1.5">
                <Ticket className="h-4 w-4 text-primary" />
                Mis Reservas
              </Link>
            )
          ) : (
            <a href="#como-funciona" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Cómo funciona
            </a>
          )}
          <span className="text-sm font-medium text-secondary/90 font-semibold">
            Conviértete en Guía
          </span>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted-light transition-all">
            <Globe className="h-3.5 w-3.5 text-muted" />
            <span>ES</span>
          </button>
          
          {session ? (
            /* Logged In State */
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-50 leading-tight">
                  {session.name}
                </span>
                <span className="text-xxs text-muted capitalize leading-tight">
                  {session.role === 'TOURIST' ? 'Turista' : 'Guía'}
                </span>
              </div>
              
              <form action={logoutAction}>
                <button
                  type="submit"
                  title="Cerrar sesión"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted hover:text-red-600 hover:bg-red-50/10 hover:border-red-500/20 transition-all shadow-sm"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            /* Logged Out State */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted-light transition-all shadow-sm"
              >
                <User className="h-3.5 w-3.5 text-muted" />
                <span>Ingresar</span>
              </Link>
              
              <Link
                href="/signup"
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover shadow-sm transition-all"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Registrarse</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
