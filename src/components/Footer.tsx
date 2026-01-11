// src/components/Footer.tsx

import Link from 'next/link';

// Definición del color institucional Vino Tinto
const COLOR_VINO = '#900222';

export default function Footer() {
    return (
        // Usamos un fondo gris muy oscuro (casi negro) para un buen contraste con el color vino
        <footer className="bg-gray-900 text-white mt-12 pt-8 pb-4">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
                    
                    {/* Columna 1: Info General */}
                    <div>
                        {/* Título en color Vino */}
                        <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_VINO }}>Sobre El Unsito</h3>
                        <p className="text-sm text-gray-400">
                            La fuente más confiable de noticias e información de la Sierra Sur. Comprometidos con la verdad y la comunidad.
                        </p>
                    </div>

                    {/* Columna 2: Navegación Rápida */}
                    <div>
                        {/* Título en color Vino */}
                        <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_VINO }}>Secciones</h3>
                        <nav className="flex flex-col space-y-2 text-sm">
                            <Link href="/" className="text-gray-400 hover:text-white transition duration-150">Inicio</Link>
                            {/* Nota: Este link es estático, idealmente debería ser dinámico */}
                            <Link href="/categoria/ID_GENERAL" className="text-gray-400 hover:text-white transition duration-150">General</Link>
                            <Link href="/contacto" className="text-gray-400 hover:text-white transition duration-150">Contacto</Link>
                        </nav>
                    </div>

                    {/* Columna 3: Contacto */}
                    <div>
                        {/* Título en color Vino */}
                        <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_VINO }}>Contacto</h3>
                        <p className="text-sm text-gray-400">Email: contacto@unsito.com</p>
                        <p className="text-sm text-gray-400">Tel: (951) 123-4567</p>
                        <p className="text-sm text-gray-400 mt-2">Dirección: Oaxaca, México</p>
                    </div>
                </div>

                {/* Derechos de Autor */}
                <div className="text-center text-gray-500 text-xs mt-4">
                    &copy; {new Date().getFullYear()} El Unsito. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}