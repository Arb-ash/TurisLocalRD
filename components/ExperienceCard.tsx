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

export default function ExperienceCard({ exp, featured = false }: { exp: Experience, featured?: boolean }) {
  const isSoldOut = exp.availableSlots <= 0;

  return (
    <Link 
      href={`/experience/${exp.id}`}
      className={`group relative flex overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 h-full ${
        featured ? 'flex-col md:flex-row md:col-span-2' : 'flex-col'
      }`}
    >
      {/* Image container: Framed editorial look to break generic card symmetry */}
      <div className={`relative p-2.5 ${featured ? 'w-full md:w-1/2 md:p-4' : 'w-full'}`}>
        <div className={`relative overflow-hidden rounded-[1.5rem] bg-muted-light ${
          featured ? 'aspect-[4/3] md:aspect-auto md:h-full' : 'aspect-[4/3]'
        }`}>
          <Image
            src={exp.imageUrl}
            alt={exp.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
            priority={exp.id <= 2}
          />
          
          {/* Dynamic Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            <span className="inline-flex items-center gap-1 rounded-full glass-effect px-3 py-1.5 text-xs font-bold text-stone-900 shadow-sm border border-white/30">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {exp.city}
            </span>
            
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-900/80 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-md">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              {exp.rating.toFixed(1)}
            </span>
          </div>

          {/* Guide Badge Overlapping Image Bottom */}
          <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-full pr-4 pl-1.5 py-1.5 flex items-center gap-2 shadow-lg z-10 border border-border/50">
            <div className="bg-primary/20 text-primary rounded-full p-1.5">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold leading-none">Guía local</span>
              <span className="text-xs font-extrabold text-foreground truncate max-w-[120px] leading-tight mt-0.5">
                {exp.guideName}
              </span>
            </div>
          </div>
          
          {/* Sold out overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-900/60 backdrop-blur-[2px] z-20">
              <span className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white shadow-xl transform -rotate-6">
                Agotado
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className={`flex flex-1 flex-col px-5 py-4 pb-6 ${featured ? 'md:px-8 md:py-8 md:justify-center' : ''}`}>
        
        {/* Title (Playfair Display) & Duration */}
        <div className="flex flex-col items-start gap-3 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            <Clock className="h-3.5 w-3.5" />
            {exp.duration}
          </span>
          
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-[1.2]">
            {exp.title}
          </h3>
        </div>

        <p className="text-sm text-muted line-clamp-2 font-light leading-relaxed">
          {exp.description}
        </p>

        {/* Footer info: Price (highlighted) and Availability (coral/secondary) */}
        <div className="mt-auto pt-6 flex items-end justify-between border-t border-border/40">
          <div className="flex flex-col">
            <span className="text-xs text-muted font-medium mb-1">Precio por persona</span>
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              ${exp.price.toFixed(2)}
            </span>
          </div>

          <div className="text-right">
            {isSoldOut ? (
              <span className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                Agotado
              </span>
            ) : exp.availableSlots <= 3 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary animate-pulse border border-secondary/20">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
                ¡Solo {exp.availableSlots} cupos!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary border border-secondary/20">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary opacity-50"></span>
                {exp.availableSlots} cupos
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
