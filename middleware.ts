import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    if (user === 'Maestra' && pwd === 'cooldown23') {
      return NextResponse.next();
    }
  }

  return new NextResponse('Autenticación requerida para acceder al sistema.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Acceso Seguro"',
    },
  });
}

export const config = {
  matcher: [
    /*
     * Intercepta todas las rutas excepto:
     * - _next/static (archivos estáticos de Next.js)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (icono del navegador)
     * - archivos con extensiones de imagen estáticas
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
