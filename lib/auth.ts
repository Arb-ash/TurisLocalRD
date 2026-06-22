import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET || 'dev-secret-key-must-be-at-least-32-chars-long-turislocalrd';
const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  userId: number;
  role: string;
  name: string;
  email: string;
  expiresAt: string;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: number, role: string, name: string, email: string) {
  const duration = 7 * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + duration);
  const session = await encrypt({
    userId,
    role,
    name,
    email,
    expiresAt: expiresAt.toISOString(),
  });
  
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  
  const payload = await decrypt(session);
  if (!payload) return null;

  // Check expiration
  if (new Date(payload.expiresAt) < new Date()) {
    return null;
  }

  return payload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
