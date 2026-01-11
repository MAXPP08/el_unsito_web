// src/components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

// Definición del color institucional Vino Tinto
const COLOR_VINO = '#900222';
const COLOR_VINO_OSCURO = '#A80028'; // Tono ligeramente más oscuro para hover/móvil

// Define los tipos de publicación fijos que quieres en el menú
const TIPOS_PUBLICACION = ['Noticia', 'Evento', 'Convocatoria', 'Aviso'];

// Icono simple de hamburguesa
const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
    </svg>
);

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    // Función para cerrar el menú y navegar
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        // Fondo en color Vino Tinto
        <header style={{ backgroundColor: COLOR_VINO }} className="shadow-xl sticky top-0 z-50"> 
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo o Título */}
                <Link href="/" className="text-2xl font-black text-white hover:text-gray-300">
                    EL UNSITO
                </Link>

                {/* Menú de Navegación (Escritorio) */}
                <nav className="hidden md:flex space-x-6">
                    <Link href="/" className="text-white hover:text-gray-300 font-medium transition duration-150">Inicio</Link>
                    
                    {/* Links de Tipos de Publicación */}
                    {TIPOS_PUBLICACION.map(tipo => (
                        <Link 
                            key={tipo} 
                            // Apunta a la Home, añadiendo el filtro 'tipo'
                            href={`/?tipo=${tipo.toLowerCase()}`} 
                            className="text-white hover:text-gray-300 font-medium transition duration-150"
                        >
                            {tipo}
                        </Link>
                    ))}
                    <Link href="/dashboard" className="text-white hover:text-gray-300 font-medium transition duration-150">Admin</Link>
                </nav>

                {/* Botón Menú Hamburguesa (Móvil) */}
                <button 
                    className="md:hidden text-white p-2 focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Abrir menú de navegación"
                >
                    <MenuIcon />
                </button>
            </div>

            {/* Menú Desplegable (Móvil) */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {/* Fondo en un tono de vino más oscuro para contraste */}
                <nav style={{ backgroundColor: COLOR_VINO_OSCURO }} className="flex flex-col p-4">
                    <Link 
                        href="/" 
                        onClick={handleLinkClick} 
                        className="text-white py-2 border-b border-gray-700 hover:bg-[#800020]"
                    >
                        Inicio
                    </Link>
                    
                    {TIPOS_PUBLICACION.map(tipo => (
                        <Link 
                            key={tipo} 
                            href={`/?tipo=${tipo.toLowerCase()}`} 
                            onClick={handleLinkClick}
                            className="text-white py-2 border-b border-gray-700 hover:bg-[#800020]"
                        >
                            {tipo}
                        </Link>
                    ))}
                    <Link 
                        href="/dashboard" 
                        onClick={handleLinkClick} 
                        className="text-white py-2 hover:bg-[#800020]"
                    >
                        Admin
                    </Link>
                </nav>
            </div>
        </header>
    );
}