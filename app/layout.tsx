import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "TurisLocalRD | Experiencias Locales Auténticas",
  description: "Conecta con guías locales y vive experiencias turísticas auténticas y sostenibles en la República Dominicana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <Navbar />
        <div className="flex-grow flex flex-col">{children}</div>
      </body>
    </html>
  );
}
