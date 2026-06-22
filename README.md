# TurisLocalRD MVP 🗺️

**TurisLocalRD** es una plataforma diseñada para dar visibilidad digital a pequeños proveedores turísticos locales y conectar a los turistas con experiencias auténticas en la República Dominicana. Este proyecto implementa un MVP funcional con un catálogo dinámico y un sistema interactivo de reservas en tiempo real.

---

## 🛠️ Tecnologías Utilizadas

- **Core**: Next.js 16 (App Router) & React 19
- **Estilos**: Tailwind CSS v4 con paleta personalizada de naturaleza y aventuras (Teal, Amber y Stone), efectos de glassmorphism y micro-animaciones.
- **Tipografía**: Outfit (importada de Google Fonts)
- **Base de Datos**: SQLite local
- **ORM**: Prisma 7 con soporte para adaptadores de controlador nativos (`@prisma/adapter-better-sqlite3` y `better-sqlite3`)
- **Autenticación**: Hashing de contraseñas con `bcryptjs` y cookies JWT firmadas usando `jose`.
- **Validación de datos**: Zod (para comprobaciones de esquemas en servidor)
- **Animaciones Premium**: Canvas-confetti (para celebrar el éxito de la reserva)
- **Iconografía**: Lucide React

---

## 📋 Funcionalidades Clave

1. **Catálogo de Experiencias Mejorado**:
   - Tarjetas responsivas basadas en Airbnb Experiences y GuruWalk.
   - Vista móvil primero (mobile-first).
   - **Filtros Avanzados**: Búsqueda por término, filtrado por provincia (6 destinos), filtrado por categoría con pestañas horizontales e iconos descriptivos (Gastronomía, Historia, Naturaleza, Playa), rango de precios (Económico, Moderado, Premium) y ordenación (Más valorados, Precio ascendente, Precio descendente). Todos sincronizados en tiempo real mediante `searchParams` asíncronos de Next.js 16.

2. **Detalles de Experiencia**:
   - Páginas de detalles dinámicas (`/experience/[id]`).
   - Información del guía certificado, categoría, duración, precio y cupos disponibles en tiempo real.

3. **Autenticación y Seguridad**:
   - Registro e Inicio de sesión interactivos para Turistas y Guías Locales.
   - Rutas protegidas y cookies cifradas HTTP-only.
   - Panel personalizado "Mis Reservas" para ver compras e itinerarios.

4. **Panel del Guía Local (`/dashboard`)**:
   - Resumen analítico en tiempo real con degradados elegantes: Ganancias calculadas, reservas recibidas, turistas guiados y tours activos.
   - Listado de reservas entrantes con desglose de datos del turista y subtotal.
   - Gestión de Tours: Publicación de nuevos tours con validación completa de Zod y guardado de categorías; eliminación de experiencias de forma segura (con alerta de confirmación e impacto directo en cascada sobre reservas activas).

5. **Sistema de Reservas y Cancelación**:
   - Formulario interactivo con pre-llenado de datos de usuario.
   - Envío asíncrono con React 19 `useActionState` (Server Action) con control de cupos y transacciones atómicas.
   - Animación de confeti al confirmar la reserva.
   - **Cancelación para Turistas**: Botón interactivo "Cancelar Reserva" en el panel "Mis Reservas" con aviso de confirmación seguro. Al cancelar, se devuelven automáticamente los cupos a la experiencia.

---

## 🗄️ Esquema de Base de Datos (Prisma)

El modelo está definido en [prisma/schema.prisma](file:///Users/masr/Desktop/Development/Projects/UNIBE/my-app/prisma/schema.prisma):

- **User**: Registra guías y turistas con sus respectivas relaciones de pertenencia.
- **Experience**: Contiene los detalles del tour (`id`, `title`, `description`, `city`, `price`, `duration`, `imageUrl`, `guideName`, `rating`, `availableSlots`, `category`).
- **Reservation**: Registra las solicitudes de viaje (`id`, `customerName`, `customerEmail`, `peopleCount`, `experienceId`, `createdAt`, `userId`).

---

## 🚀 Instrucciones de Instalación y Ejecución

Sigue estos pasos para instalar y ejecutar TurisLocalRD en tu máquina local:

### 1. Clonar e Instalar dependencias

Asegúrate de que estás en la raíz del proyecto y ejecuta:

```bash
npm install
```

### 2. Configurar Base de Datos y Migraciones

Este MVP utiliza Prisma 7. Ejecuta el siguiente comando para crear la base de datos SQLite y aplicar el esquema inicial:

```bash
npx prisma migrate dev --name init
```

### 3. Generar el Cliente de Prisma

Genera los tipos de Prisma Client necesarios para tu entorno de TypeScript:

```bash
npx prisma generate
```

### 4. Cargar Datos de Prueba (Seed)

TurisLocalRD viene con 8 experiencias pre-cargadas en 6 provincias (Santo Domingo, Santiago, Samaná, Punta Cana, Puerto Plata y La Romana) clasificadas en 4 categorías. Cárgalas ejecutando:

```bash
npx tsx prisma/seed.ts
```

### 5. Iniciar Servidor de Desarrollo

Por último, inicia la aplicación en modo desarrollo:

```bash
npm run dev
```

Abre tu navegador e ingresa a [http://localhost:3000](http://localhost:3000) para interactuar con la aplicación.

---

## 📁 Estructura del Proyecto

```txt
my-app/
├── app/
│   ├── actions/
│   │   ├── authActions.ts       # Server Actions para auth (signup, login, logout)
│   │   └── experienceActions.ts # Server Actions para tours (create, delete)
│   ├── actions.ts           # Server Actions para reservas (create, cancel)
│   ├── dashboard/           # Panel del Guía Local
│   ├── experience/[id]/     # Página de detalles de la experiencia (Dynamic Route)
│   ├── globals.css          # Estilos globales y paleta de colores de Tailwind CSS v4
│   ├── layout.tsx           # Layout principal con Navbar y contenedor global
│   ├── reservations/        # Panel del Turista
│   └── page.tsx             # Catálogo de experiencias con filtros de búsqueda y sort
├── components/
│   ├── BookingForm.tsx      # Formulario de reserva con confetti y validación (Client Component)
│   ├── CancelReservationButton.tsx # Botón interactivo para cancelar reservas (Client Component)
│   ├── ExperienceCard.tsx   # Tarjeta de catálogo para las experiencias (Server Component)
│   ├── Footer.tsx           # Pie de página informativo
│   ├── GuideDashboardClient.tsx # Cliente interactivo para panel de guía (Client Component)
│   ├── Navbar.tsx           # Barra de navegación superior con diseño responsivo
│   └── SearchFilters.tsx    # Barra de búsqueda, categorías y ordenaciones (Client Component)
├── generated/client/        # Cliente Prisma 7 autogenerado
├── lib/
│   ├── auth.ts              # Control y gestión de sesiones JWT
│   └── db.ts                # Singleton del cliente de base de datos con adaptador SQLite
├── prisma/
│   ├── migrations/          # Historial de migraciones SQL
│   ├── schema.prisma        # Definición del modelo de datos de Prisma
│   └── seed.ts              # Script de carga de datos iniciales
├── public/
│   └── images/              # Activos visuales autogenerados para las experiencias
├── package.json
└── tsconfig.json
```
