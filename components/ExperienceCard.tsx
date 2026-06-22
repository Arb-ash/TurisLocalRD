import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, Star, User } from 'lucide-react';

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
}

export default function ExperienceCard({ exp }: { exp: Experience }) {
  const isSoldOut = exp.availableSlots <= 0;

  return (
    <Link 
      href={`/experience/${exp.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-primary/20 transition-all duration-300"
    >
      {/* Image container */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted-light">
        <Image
          src={exp.imageUrl}
          alt={exp.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          priority={exp.id <= 2}
        />
        
        {/* City Badge */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full glass-effect px-2.5 py-1 text-xs font-semibold text-stone-900 shadow-sm">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {exp.city}
        </span>

        {/* Rating Badge */}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-stone-900/80 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          {exp.rating.toFixed(1)}
        </span>

        {/* Sold out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/60 backdrop-blur-[2px]">
            <span className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1 text-xs text-muted mb-2">
          <Clock className="h-3.5 w-3.5" />
          <span>{exp.duration}</span>
          <span className="mx-1.5">•</span>
          <User className="h-3.5 w-3.5" />
          <span className="truncate">Guía: {exp.guideName}</span>
        </div>

        <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {exp.title}
        </h3>

        <p className="mt-2 text-sm text-muted line-clamp-2">
          {exp.description}
        </p>

        {/* Footer info */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/60">
          <div>
            <span className="text-xs text-muted block leading-none">Desde</span>
            <span className="text-lg font-extrabold text-foreground">
              ${exp.price.toFixed(2)}
              <span className="text-xs font-normal text-muted"> / pers</span>
            </span>
          </div>

          <div className="text-right">
            {isSoldOut ? (
              <span className="text-xs font-semibold text-red-600">Sin cupos</span>
            ) : exp.availableSlots <= 3 ? (
              <span className="text-xs font-bold text-amber-600 animate-pulse">
                ¡Solo {exp.availableSlots} cupos!
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-600">
                {exp.availableSlots} cupos libres
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
