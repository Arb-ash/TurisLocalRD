'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const experienceSchema = z.object({
  title: z.string().trim().min(5, { message: 'El título debe tener al menos 5 caracteres.' }),
  description: z.string().trim().min(15, { message: 'La descripción debe tener al menos 15 caracteres.' }),
  city: z.string().trim().min(2, { message: 'Debe ingresar una ciudad o localidad válida.' }),
  price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.coerce.number({ required_error: 'Debe ingresar el precio.', invalid_type_error: 'El precio debe ser un número válido.' })
      .positive({ message: 'El precio debe ser un número positivo.' })
  ),
  duration: z.string().trim().min(2, { message: 'Debe ingresar la duración (ej: 3 horas).' }),
  availableSlots: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.coerce.number({ required_error: 'Debe ingresar los cupos disponibles.', invalid_type_error: 'La cantidad de cupos debe ser un número entero.' })
      .int({ message: 'Los cupos deben ser un número entero.' })
      .min(1, { message: 'Debe ingresar al menos 1 cupo.' })
  ),
  imageUrl: z.string().trim().min(1, { message: 'Debe ingresar o seleccionar una imagen.' }).refine(
    (val) => {
      if (val.startsWith('/')) {
        return val.startsWith('/images/');
      }
      try {
        const url = new URL(val);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    },
    {
      message: 'Debe ingresar una URL de imagen válida (ej: https://...) o seleccionar una imagen del catálogo.',
    }
  ),
  category: z.string().trim().min(2, { message: 'Debe ingresar una categoría válida.' }),
});

export type ExperienceState = {
  success?: boolean;
  message?: string;
  errors?: {
    title?: string[];
    description?: string[];
    city?: string[];
    price?: string[];
    duration?: string[];
    availableSlots?: string[];
    imageUrl?: string[];
    category?: string[];
  };
} | null;

export async function createExperience(
  prevState: ExperienceState,
  formData: FormData
): Promise<ExperienceState> {
  // Wait a short time to simulate network lag for loader
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 1. Get current guide session
  const session = await getSession();
  if (!session || session.role !== 'GUIDE') {
    return {
      success: false,
      message: 'No autorizado. Solo los guías autenticados pueden crear experiencias.',
    };
  }

  const rawFormData = {
    title: formData.get('title'),
    description: formData.get('description'),
    city: formData.get('city'),
    price: formData.get('price'),
    duration: formData.get('duration'),
    availableSlots: formData.get('availableSlots'),
    imageUrl: formData.get('imageUrl'),
    category: formData.get('category'),
  };

  // 2. Validate inputs
  const validated = experienceSchema.safeParse(rawFormData);
  if (!validated.success) {
    return {
      success: false,
      message: 'Por favor, corrige los errores en el formulario.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { title, description, city, price, duration, availableSlots, imageUrl, category } = validated.data;

  try {
    // 3. Insert into Database
    await prisma.experience.create({
      data: {
        title,
        description,
        city,
        price,
        duration,
        availableSlots,
        imageUrl,
        category,
        guideId: session.userId,
        guideName: session.name,
        rating: 5.0, // New experience starts with 5.0 rating
      },
    });

    // 4. Revalidate cache
    revalidatePath('/');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: '¡Felicidades! Tu experiencia ha sido publicada con éxito y ya está visible en el catálogo.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Ocurrió un error inesperado al publicar la experiencia.',
    };
  }
}

export async function deleteExperienceAction(
  experienceId: number
): Promise<{ success: boolean; message: string }> {
  const session = await getSession();
  if (!session || session.role !== 'GUIDE') {
    return { success: false, message: 'No autorizado. Solo los guías pueden eliminar experiencias.' };
  }

  try {
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      return { success: false, message: 'Experiencia no encontrada.' };
    }

    if (experience.guideId !== session.userId) {
      return { success: false, message: 'No tienes permiso para eliminar esta experiencia.' };
    }

    // Delete experience (reservations cascade delete)
    await prisma.experience.delete({
      where: { id: experienceId },
    });

    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'La experiencia ha sido eliminada con éxito.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Ocurrió un error al eliminar la experiencia.',
    };
  }
}
