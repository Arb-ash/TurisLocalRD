'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const signupSchema = z.object({
  name: z.string().trim().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  email: z.string().trim().email({ message: 'Debe ingresar un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  role: z.enum(['TOURIST', 'GUIDE'], { message: 'Rol inválido.' }),
});

const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Debe ingresar un correo electrónico válido.' }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
});

export type AuthState = {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
} | null;

export async function signupAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawFormData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  };

  // 1. Validate fields
  const validated = signupSchema.safeParse(rawFormData);
  if (!validated.success) {
    return {
      success: false,
      message: 'Por favor, corrige los errores en el formulario.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, role } = validated.data;

  try {
    // 2. Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'Este correo electrónico ya está registrado.',
        errors: {
          email: ['El correo electrónico ya está en uso.'],
        },
      };
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
    });

    // 5. Create session
    await createSession(user.id, user.role, user.name, user.email);

  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Ocurrió un error inesperado al registrar el usuario.',
    };
  }

  // Redirect after success
  redirect('/');
}

export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawFormData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  // 1. Validate fields
  const validated = loginSchema.safeParse(rawFormData);
  if (!validated.success) {
    return {
      success: false,
      message: 'Campos requeridos vacíos o inválidos.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validated.data;

  try {
    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Correo electrónico o contraseña incorrectos.',
      };
    }

    // 3. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Correo electrónico o contraseña incorrectos.',
      };
    }

    // 4. Create session
    await createSession(user.id, user.role, user.name, user.email);

  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Ocurrió un error inesperado al iniciar sesión.',
    };
  }

  // Redirect after success
  redirect('/');
}

export async function logoutAction() {
  await deleteSession();
  redirect('/');
}
