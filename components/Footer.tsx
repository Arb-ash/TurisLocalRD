import Link from 'next/link';
import { Compass, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Compass className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                TurisLocal<span className="text-primary">RD</span>
              </span>
            </Link>
            <p className="text-sm text-muted max-w-sm">
              Conectando viajeros con la esencia de cada comunidad a través de experiencias locales, auténticas y sostenibles guiadas por anfitriones apasionados.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase">Comunidad</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  Guias Locales
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  Historias de Éxito
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  Turismo Sostenible
                </a>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase">Soporte</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  Términos y Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-8 border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} TurisLocalRD. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted">
            <span>Hecho con</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
            <span>para el desarrollo turístico local.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
