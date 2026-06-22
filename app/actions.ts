'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

const bookingSchema = z.object({
  experienceId: z.coerce.number().int().positive('ID de experiencia inválido.'),
  customerName: z.string().trim().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  customerEmail: z.string().trim().email({ message: 'Debe ingresar un correo electrónico válido.' }),
  peopleCount: z.coerce.number().int().min(1, { message: 'Debe reservar al menos para 1 persona.' }),
});

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    customerName?: string[];
    customerEmail?: string[];
    peopleCount?: string[];
  };
  data?: {
    reservationId: number;
    experienceTitle: string;
    customerName: string;
    peopleCount: number;
  };
} | null;

export async function createReservation(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Wait short time to simulate network lag for beautiful UI loaders
  await new Promise((resolve) => setTimeout(resolve, 800));

  const rawFormData = {
    experienceId: formData.get('experienceId'),
    customerName: formData.get('customerName'),
    customerEmail: formData.get('customerEmail'),
    peopleCount: formData.get('peopleCount'),
  };

  // 1. Zod Validation
  const validated = bookingSchema.safeParse(rawFormData);
  if (!validated.success) {
    return {
      success: false,
      message: 'Por favor, corrige los errores en el formulario.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { experienceId, customerName, customerEmail, peopleCount } = validated.data;

  try {
    // 2. Perform DB Transaction (atomic check & decrement slots)
    const result = await prisma.$transaction(async (tx) => {
      // Find the experience first
      const experience = await tx.experience.findUnique({
        where: { id: experienceId },
      });

      if (!experience) {
        throw new Error('La experiencia seleccionada no existe.');
      }

      // Check available slots
      if (experience.availableSlots < peopleCount) {
        throw new Error(
          `Lo sentimos, solo quedan ${experience.availableSlots} cupos disponibles para esta experiencia.`
        );
      }

      // Decrement available slots
      await tx.experience.update({
        where: { id: experienceId },
        data: {
          availableSlots: experience.availableSlots - peopleCount,
        },
      });

      // Check current user session to link reservation
      const session = await getSession();

      // Create the reservation record
      const reservation = await tx.reservation.create({
        data: {
          customerName,
          customerEmail,
          peopleCount,
          experienceId,
          userId: session?.userId || null,
        },
      });

      return {
        reservationId: reservation.id,
        experienceTitle: experience.title,
        customerName: reservation.customerName,
        peopleCount: reservation.peopleCount,
      };
    });

    // 3. Revalidate Paths to update available slots on UI
    revalidatePath('/');
    revalidatePath(`/experience/${experienceId}`);

    return {
      success: true,
      message: '¡Tu reserva ha sido confirmada con éxito!',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Ocurrió un error inesperado al procesar tu reserva.',
    };
  }
}

export async function cancelReservationAction(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: 'No autorizado. Por favor inicia sesión.' };
  }

  const reservationId = Number(formData.get('reservationId'));
  if (isNaN(reservationId)) {
    return { success: false, message: 'ID de reserva inválido.' };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Find reservation
      const res = await tx.reservation.findUnique({
        where: { id: reservationId },
        include: { experience: true },
      });

      if (!res) {
        throw new Error('Reserva no encontrada.');
      }

      // Check ownership (only the tourist who booked can cancel)
      if (res.userId !== session.userId) {
        throw new Error('No tienes permiso para cancelar esta reserva.');
      }

      // Add slots back to experience
      await tx.experience.update({
        where: { id: res.experienceId },
        data: {
          availableSlots: res.experience.availableSlots + res.peopleCount,
        },
      });

      // Delete reservation
      await tx.reservation.delete({
        where: { id: reservationId },
      });

      return res.experienceId;
    });

    // Revalidate paths
    revalidatePath('/');
    revalidatePath(`/experience/${result}`);
    revalidatePath('/reservations');

    return {
      success: true,
      message: 'Tu reserva ha sido cancelada con éxito y los cupos han sido liberados.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Ocurrió un error inesperado al cancelar la reserva.',
    };
  }
}
