// src/app/noticia/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Definición del color institucional Vino Tinto
const COLOR_VINO = '#900222';
const COLOR_VINO_OSCURO = '#A80028'; 

// Tipo de datos de la publicación completa
interface PublicacionDetalle {
    _id: string;
    titulo: string;
    contenido_completo: string;
    imagen_principal_url: string;
    tipo: string;
    resumen: string;
    categoria: { _id: string; nombre: string };
    // Puedes añadir campos de autor, fecha, etc.
}

export default function NoticiaDetallePage() {
    const params = useParams<{ id: string }>(); 
    const publicacionId = params.id;
    
    const [publicacion, setPublicacion] = useState<PublicacionDetalle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!publicacionId) return;

        const fetchPublicacion = async () => {
            try {
                const res = await api.get(`/publicaciones/${publicacionId}`); 
                setPublicacion(res.data);
            } catch (err: any) {
                if (err.response && err.response.status === 404) {
                    setError('La noticia solicitada no fue encontrada.');
                } else {
                    setError('Error al cargar el contenido de la noticia.');
                }
                console.error("Error loading publication:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicacion();
    }, [publicacionId]);

    if (loading) {
        return <div className="text-center p-10">Cargando noticia...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-600 font-semibold">{error}</div>;
    }

    if (!publicacion) {
        return <div className="text-center p-10 text-gray-500">No se pudo cargar la información.</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{publicacion.titulo}</h1>
            
            {/* Tipo/Categoría en color Vino */}
            <div className="text-sm font-medium mb-6" style={{ color: COLOR_VINO }}>
                {publicacion.tipo} | Categoría: {publicacion.categoria.nombre}
            </div>

            <img 
                src={publicacion.imagen_principal_url} 
                alt={publicacion.titulo} 
                className="w-full h-96 object-cover rounded-lg shadow-md mb-6" 
            />
            
            {/* Borde del Resumen en color Vino */}
            <p 
                className="text-lg italic text-gray-600 mb-8 border-l-4 pl-4"
                style={{ borderColor: COLOR_VINO }}
            >
                {publicacion.resumen}
            </p>
            
            <div className="prose max-w-none text-gray-800 leading-relaxed">
                <p>{publicacion.contenido_completo}</p>
            </div>
            
            {/* Enlace de regreso en color Vino */}
            <Link 
                href="/" 
                className="mt-10 inline-block font-bold hover:text-[#A80028] transition duration-150"
                style={{ color: COLOR_VINO }}
            >
                ← Volver a la página principal
            </Link>
        </div>
    );
}