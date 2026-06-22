'use client';

import { useActionState, useEffect, useState } from 'react';
import { createExperience, deleteExperienceAction, ExperienceState } from '@/app/actions/experienceActions';
import Image from 'next/image';
import { 
  TrendingUp, 
  Map, 
  Users, 
  Ticket, 
  DollarSign, 
  PlusCircle, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Clock, 
  Star,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Experience {
  id: number;
  title: string;
  description: string;
  city: string;
  price: number;
  duration: string;
  imageUrl: string;
  guideName: string;
  rating: number;
  availableSlots: number;
  category: string;
}

interface Reservation {
  id: number;
  customerName: string;
  customerEmail: string;
  peopleCount: number;
  createdAt: Date;
  experience: Experience;
}

interface GuideDashboardClientProps {
  session: any;
  experiences: (Experience & { reservations: any[] })[];
  reservations: (Reservation & { experience: Experience })[];
}

const PRESET_IMAGES = [
  { path: '/images/gastronomia.jpg', label: 'Gastronomía' },
  { path: '/images/zona_colonial.jpg', label: 'Zona Colonial' },
  { path: '/images/tres_ojos.jpg', label: 'Los Tres Ojos' },
  { path: '/images/cultural_nocturno.jpg', label: 'Nocturno Cultural' },
];

const initialState: ExperienceState = null;

export default function GuideDashboardClient({
  session,
  experiences,
  reservations,
}: GuideDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'tours' | 'create'>('bookings');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].path);
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const [state, formAction, isPending] = useActionState(createExperience, initialState);

  // States for deleting experience
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteExperienceAction(id);
      if (res.success) {
        setConfirmingDeleteId(null);
      } else {
        setDeleteError(res.message);
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  // Compute stats
  const totalEarnings = reservations.reduce(
    (sum, res) => sum + res.peopleCount * res.experience.price,
    0
  );
  const totalTours = experiences.length;
  const totalBookings = reservations.length;
  const totalTourists = reservations.reduce((sum, res) => sum + res.peopleCount, 0);

  // Trigger confetti on successful tour creation
  useEffect(() => {
    if (state?.success) {
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#0f766e', '#d97706', '#14b8a6', '#f59e0b'],
      });
      // Switch back to tours tab after showing success
      const timer = setTimeout(() => {
        setActiveTab('tours');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="rounded-3xl border border-teal-500/15 bg-gradient-to-br from-teal-500/10 to-emerald-500/5 p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-700 dark:text-teal-400">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted block leading-none">Ganancias Totales</span>
            <span className="text-xl font-extrabold text-stone-900 dark:text-stone-50 mt-1 block">
              ${totalEarnings.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="rounded-3xl border border-amber-500/15 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-400">
            <Map className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted block leading-none">Tours Publicados</span>
            <span className="text-xl font-extrabold text-stone-900 dark:text-stone-50 mt-1 block">
              {totalTours}
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-3xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-700 dark:text-indigo-400">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted block leading-none">Reservas Recibidas</span>
            <span className="text-xl font-extrabold text-stone-900 dark:text-stone-50 mt-1 block">
              {totalBookings}
            </span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted block leading-none">Turistas Guiados</span>
            <span className="text-xl font-extrabold text-stone-900 dark:text-stone-50 mt-1 block">
              {totalTourists}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all ${
            activeTab === 'bookings'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <Ticket className="h-4 w-4" />
          Reservas Recibidas ({totalBookings})
        </button>
        <button
          onClick={() => setActiveTab('tours')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all ${
            activeTab === 'tours'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <Map className="h-4 w-4" />
          Mis Experiencias ({totalTours})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all ${
            activeTab === 'create'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <PlusCircle className="h-4 w-4" />
          Publicar Nuevo Tour
        </button>
      </div>

      {/* Tab 1: Bookings list */}
      {activeTab === 'bookings' && (
        <div className="fade-in-up">
          {reservations.length > 0 ? (
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-stone-700 dark:text-stone-300">
                  <thead className="bg-stone-50 dark:bg-stone-900 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-6 py-4">Turista</th>
                      <th className="px-6 py-4">Tour Reservado</th>
                      <th className="px-6 py-4">Viajeros</th>
                      <th className="px-6 py-4">Fecha Reserva</th>
                      <th className="px-6 py-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-muted-light/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">{res.customerName}</div>
                          <div className="text-xs text-muted mt-0.5">{res.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {res.experience.title}
                        </td>
                        <td className="px-6 py-4 text-stone-950 dark:text-stone-50 font-bold">
                          {res.peopleCount}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted">
                          {new Date(res.createdAt).toLocaleDateString('es-DO', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-foreground">
                          ${(res.peopleCount * res.experience.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-sm max-w-lg mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted-light text-muted">
                <Ticket className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">Sin reservas activas</h3>
              <p className="mt-2 text-xs text-muted">
                Aún no has recibido reservas para tus experiencias. ¡Asegúrate de que tus tours sean atractivos!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Tours grid */}
      {activeTab === 'tours' && (
        <div className="fade-in-up">
          {experiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="relative aspect-video bg-muted-light">
                    <Image
                      src={exp.imageUrl}
                      alt={exp.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full glass-effect px-2.5 py-1 text-xs font-semibold text-stone-900 shadow-sm">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {exp.city}
                    </span>
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-stone-950/80 px-2 py-0.5 text-xxs font-bold text-white shadow-sm">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {exp.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-foreground text-base line-clamp-1">{exp.title}</h4>
                      <p className="text-xs text-muted mt-1.5 line-clamp-2">{exp.description}</p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-border/60 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-muted block">Precio</span>
                          <span className="font-extrabold text-foreground text-sm">${exp.price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted block">Cupos Libres</span>
                          <span className="font-bold text-emerald-600 text-sm">{exp.availableSlots} cupos</span>
                        </div>
                        <div>
                          <span className="text-muted block">Duración</span>
                          <span className="font-bold text-stone-700 dark:text-stone-300 text-sm">{exp.duration}</span>
                        </div>
                      </div>

                      {/* Deletion & Category bar */}
                      <div className="border-t border-border/40 pt-3 flex items-center justify-between">
                        <span className="text-xxs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                          {exp.category || 'Naturaleza'}
                        </span>

                        {confirmingDeleteId === exp.id ? (
                          <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-xl">
                            <span className="text-[10px] font-bold text-red-600">¿Eliminar?</span>
                            <button
                              onClick={() => handleDelete(exp.id)}
                              disabled={isDeleting}
                              className="rounded bg-red-600 hover:bg-red-700 text-white text-[10px] font-extrabold px-2 py-0.5 transition-all shadow-sm cursor-pointer"
                            >
                              {isDeleting ? '...' : 'Sí'}
                            </button>
                            <button
                              onClick={() => setConfirmingDeleteId(null)}
                              disabled={isDeleting}
                              className="rounded border border-border bg-card text-foreground text-[10px] font-bold px-2 py-0.5 transition-all cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmingDeleteId(exp.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-500/10 px-2.5 py-1.5 rounded-xl border border-transparent hover:border-red-500/20 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </button>
                        )}
                      </div>
                      
                      {deleteError && confirmingDeleteId === exp.id && (
                        <p className="text-[10px] text-red-600 font-bold text-center mt-1">{deleteError}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-sm max-w-lg mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted-light text-muted">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">No tienes tours publicados</h3>
              <p className="mt-2 text-xs text-muted">
                Comienza a publicar tours para que los turistas puedan encontrarte y reservar.
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                Publicar Primer Tour
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Form */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm fade-in-up">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            Publicar una Nueva Experiencia
          </h3>
          <p className="text-xs text-muted mt-1">
            Llena los detalles del tour. Una vez publicado, se listará de inmediato en el catálogo de TurisLocalRD.
          </p>

          {/* Success / Error banners */}
          {state?.message && (
            <div className={`mt-4 rounded-xl border p-3 text-sm flex items-start gap-2.5 ${
              state.success 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                : 'bg-red-500/10 border-red-500/20 text-red-600'
            }`}>
              {state.success ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}
              <span>{state.message}</span>
            </div>
          )}

          <form action={formAction} className="mt-6 space-y-4">
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Título del Tour
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                disabled={isPending}
                placeholder="Ej: Paseo a Caballo al Atardecer en Cabarete"
                className={`mt-1.5 w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                  state?.errors?.title ? 'border-red-500 focus-visible:ring-red-500' : 'border-border'
                }`}
              />
              {state?.errors?.title && (
                <p className="mt-1 text-xs text-red-600">{state.errors.title[0]}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Categoría
              </label>
              <select
                id="category"
                name="category"
                required
                disabled={isPending}
                defaultValue="Naturaleza"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all cursor-pointer"
              >
                <option value="Gastronomía">Gastronomía</option>
                <option value="Historia">Historia</option>
                <option value="Naturaleza">Naturaleza</option>
                <option value="Playa">Playa</option>
              </select>
              {state?.errors?.category && (
                <p className="mt-1 text-xs text-red-600">{state.errors.category[0]}</p>
              )}
            </div>

            {/* Grid for City, Price, Duration, Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Ciudad / Ubicación
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  disabled={isPending}
                  placeholder="Ej: Puerto Plata"
                  className={`mt-1.5 w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                    state?.errors?.city ? 'border-red-500 focus-visible:ring-red-500' : 'border-border'
                  }`}
                />
                {state?.errors?.city && (
                  <p className="mt-1 text-xs text-red-600">{state.errors.city[0]}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Precio (USD / pers)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  disabled={isPending}
                  placeholder="Ej: 35.00"
                  className={`mt-1.5 w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                    state?.errors?.price ? 'border-red-500 focus-visible:ring-red-500' : 'border-border'
                  }`}
                />
                {state?.errors?.price && (
                  <p className="mt-1 text-xs text-red-600">{state.errors.price[0]}</p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Duración
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="text"
                  required
                  disabled={isPending}
                  placeholder="Ej: 3 horas"
                  className={`mt-1.5 w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                    state?.errors?.duration ? 'border-red-500 focus-visible:ring-red-500' : 'border-border'
                  }`}
                />
                {state?.errors?.duration && (
                  <p className="mt-1 text-xs text-red-600">{state.errors.duration[0]}</p>
                )}
              </div>

              {/* Available slots */}
              <div>
                <label htmlFor="availableSlots" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Cupos Disponibles Iniciales
                </label>
                <input
                  id="availableSlots"
                  name="availableSlots"
                  type="number"
                  required
                  disabled={isPending}
                  placeholder="Ej: 12"
                  className={`mt-1.5 w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                    state?.errors?.availableSlots ? 'border-red-500 focus-visible:ring-red-500' : 'border-border'
                  }`}
                />
                {state?.errors?.availableSlots && (
                  <p className="mt-1 text-xs text-red-600">{state.errors.availableSlots[0]}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Descripción Completa
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                disabled={isPending}
                placeholder="Describe los lugares a visitar, actividades, comida incluida, qué llevar, etc..."
                className={`mt-1.5 w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                  state?.errors?.description ? 'border-red-500 focus-visible:ring-red-500' : 'border-border'
                }`}
              />
              {state?.errors?.description && (
                <p className="mt-1 text-xs text-red-600">{state.errors.description[0]}</p>
              )}
            </div>

            {/* Image selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Imagen de Presentación
                </span>
                
                <button
                  type="button"
                  onClick={() => setUseCustomUrl(!useCustomUrl)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {useCustomUrl ? 'Usar imágenes del catálogo' : 'Ingresar enlace personalizado'}
                </button>
              </div>

              {/* Preset selection grid */}
              {!useCustomUrl ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_IMAGES.map((img) => {
                    const isSelected = selectedImage === img.path;
                    return (
                      <button
                        key={img.path}
                        type="button"
                        onClick={() => setSelectedImage(img.path)}
                        className={`group relative aspect-video w-full rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected ? 'border-primary scale-102 ring-2 ring-primary/20' : 'border-border opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={img.path}
                          alt={img.label}
                          fill
                          sizes="(max-width: 768px) 25vw, 10vw"
                          className="object-cover"
                        />
                        <span className="absolute bottom-1 left-1.5 right-1.5 text-center text-xxs font-bold text-white bg-black/60 px-1 py-0.5 rounded backdrop-blur-[1px] truncate">
                          {img.label}
                        </span>
                      </button>
                    );
                  })}
                  {/* Hidden Input transmitting the active selection */}
                  <input type="hidden" name="imageUrl" value={selectedImage} />
                </div>
              ) : (
                /* Custom url text input */
                <div className="relative mt-1.5">
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    required
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://enlace-a-tu-imagen.jpg"
                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                      state?.errors?.imageUrl ? 'border-red-500 focus-visible:ring-red-500' : 'border-border'
                    }`}
                  />
                  {state?.errors?.imageUrl && (
                    <p className="mt-1 text-xs text-red-600">{state.errors.imageUrl[0]}</p>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Publicando experiencia...</span>
                </>
              ) : (
                <>
                  <span>Publicar Experiencia</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
