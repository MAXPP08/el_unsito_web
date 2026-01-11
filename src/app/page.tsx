// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useSearchParams } from 'next/navigation'; // Hook para leer parámetros de la URL

// Definición del tipo de datos para una publicación en la Home
interface PublicacionHome {
    _id: string;
    titulo: string;
    resumen: string;
    imagen_principal_url: string | null;
    tipo: string;
    categoria: { _id: string; nombre: string } | null; 
}

export default function HomePage() {
    const [publicaciones, setPublicaciones] = useState<PublicacionHome[]>([]);
    const [loading, setLoading] = useState(true);
    
    // OBTENER LOS PARÁMETROS DE BÚSQUEDA
    const searchParams = useSearchParams();
    const tipo = searchParams.get('tipo'); // Lee el valor de ?tipo=...
    
    // Calcula el título a mostrar
    const titulo = tipo ? `Últimos ${tipo}` : 'Últimas Noticias';

    useEffect(() => {
        const fetchPublicaciones = async () => {
            setLoading(true); // Se inicia la carga cada vez que el filtro cambia
            
            try {
                // Construir la URL de la API con el filtro 'tipo' si existe
                let url = '/publicaciones?page=1&limit=9';
                if (tipo) {
                    // Aseguramos que el tipo esté capitalizado para que coincida con la BD (Noticia, Evento, etc.)
                    const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
                    url += `&tipo=${tipoCapitalizado}`; 
                }
                
                const res = await api.get(url); 
                
                if (res.data && Array.isArray(res.data.publicaciones)) {
                    setPublicaciones(res.data.publicaciones);
                } else {
                    setPublicaciones([]);
                }
                
            } catch (error) {
                console.error("Error al cargar publicaciones:", error);
                setPublicaciones([]);
            } finally {
                setLoading(false);
            }
        };
        
        // La dependencia [tipo] hace que el efecto se vuelva a ejecutar
        // cada vez que el usuario hace clic en un enlace del Header
        fetchPublicaciones();
    }, [tipo]); 

    if (loading) {
        return <div className="text-center p-10">Cargando publicaciones...</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            {/* Título Dinámico */}
            <h1 className="text-3xl font-extrabold text-red-600 mb-6 border-b pb-2">{titulo}</h1>
            
            {publicaciones.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                    No hay publicaciones disponibles para {tipo ? `el tipo '${tipo}'` : 'mostrar.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {publicaciones.map(pub => (
                        <PublicacionCard key={pub._id} publicacion={pub} />
                    ))}
                </div>
            )}
        </div>
    );
}

// Componente simple para mostrar la noticia en la Home
const PublicacionCard = ({ publicacion }: { publicacion: PublicacionHome }) => {
    const slug = publicacion._id; 
    
    // PROTECCIÓN 1: Manejar URL de imagen nula/vacía
    const imageUrl = publicacion.imagen_principal_url || '/images/placeholder.jpg'; 

    // PROTECCIÓN 2: Manejar categoría nula/undefined
    const categoriaNombre = publicacion.categoria?.nombre || 'Sin Categoría';
    
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
            <img 
                src={imageUrl} 
                alt={publicacion.titulo} 
                className="w-full h-48 object-cover" 
            />
            <div className="p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                    {publicacion.tipo} / {categoriaNombre} 
                </span>
                <h2 className="text-xl font-bold text-gray-800 mt-2 mb-2 hover:text-red-700">
                    <Link href={`/noticia/${slug}`}>{publicacion.titulo}</Link>
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">{publicacion.resumen}</p>
                <Link href={`/noticia/${slug}`} className="mt-3 inline-block text-red-600 font-medium text-sm hover:text-red-700">
                    Leer más →
                </Link>
            </div>
        </div>
    );
};