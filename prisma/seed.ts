import { prisma } from '../lib/db';

async function main() {
  // Clear existing data
  await prisma.reservation.deleteMany({});
  await prisma.experience.deleteMany({});

  const experiences = [
    {
      title: 'Tour Gastronómico en Santo Domingo',
      description: 'Explora los sabores más auténticos de la República Dominicana. Disfruta de un recorrido guiado degustando mangú con los tres golpes, empanadillas artesanales, catibías de yuca, dulces criollos tradicionales y un refrescante jugo de chinola. Aprenderás sobre las raíces culinarias que definen nuestra identidad gastronómica.',
      city: 'Santo Domingo',
      price: 39.99,
      duration: '3 horas',
      imageUrl: '/images/gastronomia.jpg',
      guideName: 'Mariana Gómez',
      rating: 4.9,
      availableSlots: 12,
      category: 'Gastronomía',
    },
    {
      title: 'Ruta Histórica de la Zona Colonial',
      description: 'Viaja en el tiempo en la primera ciudad del Nuevo Mundo. Visitaremos el Alcázar de Colón, la Catedral Primada de América y la Fortaleza Ozama. Descubre las leyendas de piratas, colonizadores y revolucionarios que dieron forma a la historia de Santo Domingo y el continente.',
      city: 'Santo Domingo',
      price: 25.00,
      duration: '4 horas',
      imageUrl: '/images/zona_colonial.jpg',
      guideName: 'Carlos Pichardo',
      rating: 4.8,
      availableSlots: 15,
      category: 'Historia',
    },
    {
      title: 'Excursión Ecológica a Los Tres Ojos',
      description: 'Adéntrate en este oasis subterráneo de cuevas y lagos de agua dulce en medio de la ciudad. Cruzaremos en barca flotante el lago subterráneo para llegar al cuarto lago al aire libre rodeado de una exuberante vegetación tropical. Perfecto para amantes de la naturaleza y la fotografía.',
      city: 'Santo Domingo',
      price: 30.00,
      duration: '2.5 horas',
      imageUrl: '/images/tres_ojos.jpg',
      guideName: 'Julio Santana',
      rating: 4.7,
      availableSlots: 8,
      category: 'Naturaleza',
    },
    {
      title: 'Tour Cultural Nocturno en Santiago',
      description: 'Vive la vibrante vida nocturna de la Ciudad Corazón. Conocerás el Monumento a los Héroes de la Restauración iluminado, visitarás un club local de son y bachata tradicional, degustarás la típica yaroa dominicana y disfrutarás de una cata de ron artesanal dirigida por un experto.',
      city: 'Santiago',
      price: 49.99,
      duration: '3.5 horas',
      imageUrl: '/images/cultural_nocturno.jpg',
      guideName: 'Ramón Almonte',
      rating: 4.9,
      availableSlots: 10,
      category: 'Historia',
    },
    {
      title: 'Avistamiento de Ballenas Jorobadas y Cayo Levantado',
      description: 'Disfruta de un espectáculo natural inolvidable en la Bahía de Samaná. Observaremos de cerca el comportamiento de las ballenas jorobadas en su santuario de apareamiento. Luego, navegaremos hacia el paradisíaco Cayo Levantado para almorzar comida típica y disfrutar de sus arenas blancas.',
      city: 'Samaná',
      price: 65.00,
      duration: '7 horas',
      imageUrl: '/images/ballenas_samana.jpg',
      guideName: 'José Almonte',
      rating: 4.9,
      availableSlots: 20,
      category: 'Naturaleza',
    },
    {
      title: 'Aventura en Buggy y Baño en Cenote Azul',
      description: 'Conduce potentes buggies por senderos llenos de barro y cocoteros en la zona rural de Punta Cana. Haremos una parada técnica en una cueva subterránea para nadar en un cenote de agua dulce cristalina y visitaremos un rancho de cacao y café tradicional.',
      city: 'Punta Cana',
      price: 59.99,
      duration: '4 horas',
      imageUrl: '/images/buggy_punta_cana.jpg',
      guideName: 'David Santana',
      rating: 4.6,
      availableSlots: 12,
      category: 'Naturaleza',
    },
    {
      title: 'Teleférico y Senderismo en Loma Isabel de Torres',
      description: 'Sube en el único teleférico del Caribe hasta la cima de la montaña. En la cumbre, realizaremos una caminata guiada por senderos rodeados de jardines botánicos nublados con flora exótica. Disfruta de la imponente estatua del Cristo Redentor y vistas panorámicas de Puerto Plata.',
      city: 'Puerto Plata',
      price: 28.00,
      duration: '3 horas',
      imageUrl: '/images/teleferico_puerto_plata.jpg',
      guideName: 'Ana Rosario',
      rating: 4.8,
      availableSlots: 15,
      category: 'Naturaleza',
    },
    {
      title: 'Snorkeling y Catamarán a Isla Saona',
      description: 'Embárcate en un catamarán de vela de lujo rumbo a la isla más famosa de República Dominicana. Pararemos en las piscinas naturales de poca profundidad para observar estrellas de mar gigantes, hacer snorkeling en arrecifes de coral y descansar en una playa privada de cocoteros.',
      city: 'La Romana',
      price: 75.00,
      duration: '8 horas',
      imageUrl: '/images/saona_romana.jpg',
      guideName: 'Luis Mercedes',
      rating: 4.9,
      availableSlots: 18,
      category: 'Playa',
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({
      data: exp,
    });
  }

  console.log('Database successfully seeded with 8 experiences!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
