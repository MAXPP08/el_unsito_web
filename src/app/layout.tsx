// src/app/layout.tsx

import type { Metadata } from "next";
// Importa las fuentes que ya estabas usando
import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";

// *** 1. IMPORTAR LOS NUEVOS COMPONENTES ***
import Header from '@/components/Header'; // Asegúrate de que esta ruta sea correcta
import Footer from '@/components/Footer'; // Asegúrate de que esta ruta sea correcta

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// *** 2. ACTUALIZAR METADATA ***
export const metadata: Metadata = {
  title: "El Unsito | Noticias de la Sierra Sur", // Título de tu aplicación
  description: "Noticias, eventos y convocatorias de la Sierra Sur de Oaxaca.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // *** 3. CAMBIAR EL IDIOMA A ESPAÑOL ***
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* === COLOCAR HEADER Y FOOTER AQUÍ === */}
        
        <Header /> 
        
        {/* El children (el contenido de cada página) va dentro del contenedor principal */}
        <main>
            {children}
        </main>
        
        <Footer />
        
        {/* === FIN DE LA COLOCACIÓN === */}
      </body>
    </html>
  );
}