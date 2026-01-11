'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { Publicacion } from '@/types';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //[cite_start]// [cite: 262] Cargar noticias
  const fetchNoticias = async () => {
    try {
      const res = await api.get('/publicaciones');
      // Ajuste por si tu backend devuelve { publicaciones: [...] } o directamente el array
      setPublicaciones(res.data.publicaciones || res.data);
    } catch (error) {
      console.error("Error cargando noticias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  //[cite_start]// [cite: 275] Eliminar publicación
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta publicación?")) {
      try {
        await api.delete(`/publicaciones/${id}`);
        setPublicaciones(publicaciones.filter(pub => pub._id !== id));
      } catch (error) {
        alert("No se pudo eliminar la publicación");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  //[cite_start]// Helper para estilos (badges) [cite: 284]
  const getBadgeClass = (tipo: string) => {
    switch(tipo) {
      case 'Noticia': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Evento': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Convocatoria': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-gray-600">Cargando sistema...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 bg-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-800">Unsito Admin</h1>
        <div className="flex gap-4 items-center text-sm">
          <span className="text-gray-600">Hola, Admin</span>
          <button onClick={handleLogout} className="text-red-600 hover:underline font-medium">
            (Cerrar Sesión)
          </button>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Contenido</h2>
          <div className="flex gap-3">
            <Link 
              href="/dashboard/crear-noticia" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition shadow-sm"
            >
              + Nueva Publicación
            </Link>
            <Link 
              href="/dashboard/gacetas" 
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition shadow-sm"
            >
              Gacetas
            </Link>
          </div>
        </div>

        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 border-b">Título</th>
                  <th className="p-4 border-b">Tipo</th>
                  <th className="p-4 border-b">Categoría</th>
                  <th className="p-4 border-b">Fecha</th>
                  <th className="p-4 border-b text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {publicaciones.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No hay publicaciones registradas. ¡Comienza creando una!
                    </td>
                  </tr>
                ) : (
                  publicaciones.map((pub) => (
                    <tr key={pub._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-900">
                        {pub.es_destacado && <span title="Destacado" className="mr-2 text-yellow-500">★</span>}
                        {pub.titulo}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getBadgeClass(pub.tipo)}`}>
                          {pub.tipo}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {typeof pub.categoria === 'object' ? pub.categoria?.nombre : 'Sin categoría'}
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(pub.fecha_publicacion).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 text-center flex justify-center gap-2">
                        <Link href={`/dashboard/editar-noticia/${pub._id}`}>
                          <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs">
                            Editar
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(pub._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}