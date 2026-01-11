'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import api from '@/lib/axios';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Categoria } from '@/types';

export default function EditNewsPage() {
  const { id } = useParams(); // Obtener ID de la URL
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    contenido_completo: '',
    tipo: 'Noticia',
    categoria: '',
    es_destacado: false,
    imagen_principal_url: ''
  });
  const [newFile, setNewFile] = useState<File | null>(null);

  //[cite_start]// [cite: 414] Cargar datos
  useEffect(() => {
    const getData = async () => {
      try {
        const catRes = await api.get('/categorias');
        setCategorias(catRes.data);

        if (id) {
          const pubRes = await api.get(`/publicaciones/${id}`);
          const pub = pubRes.data;
          
          setFormData({
            titulo: pub.titulo,
            resumen: pub.resumen,
            contenido_completo: pub.contenido_completo,
            tipo: pub.tipo,
            // Si viene poblado es objeto, si no es string
            categoria: pub.categoria?._id || pub.categoria || '',
            es_destacado: pub.es_destacado,
            imagen_principal_url: pub.imagen_principal_url
          });
        }
      } catch (error) {
        alert("No se pudo cargar la noticia");
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalImageUrl = formData.imagen_principal_url;

      //[cite_start]// [cite: 444] Si hay nueva imagen, subirla
      if (newFile) {
        const uploadData = new FormData();
        uploadData.append('file', newFile);
        const upRes = await api.post('/upload', uploadData, {
           headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = upRes.data.url;
      }

      //[cite_start]// [cite: 457] Actualizar (PUT)
      await api.put(`/publicaciones/${id}`, {
        ...formData,
        imagen_principal_url: finalImageUrl
      });

      alert("¡Actualizado correctamente!");
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setNewFile(e.target.files[0]);
  };

  //[cite_start]// Helper para mostrar imagen actual (Lógica adaptada de tu código original [cite: 490])
  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // Limpieza simple de path si viene local
    const filename = url.replace(/\\/g, '/').split('/').pop();
    return `http://localhost:3000/uploads/${filename}`;
  };

  if (loading) return <div className="text-center mt-10">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Editar Noticia</h2>
          <Link href="/dashboard">
            <button className="text-gray-500 hover:text-red-500 font-medium">X Cancelar</button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          [cite_start]{/* Previsualización Imagen [cite: 484] */}
          {formData.imagen_principal_url && !newFile && (
             <div className="text-center bg-gray-100 p-4 rounded-lg">
               <p className="text-gray-500 mb-2 text-sm font-semibold">Imagen actual:</p>
               <img 
                 src={getImageUrl(formData.imagen_principal_url)} 
                 alt="Actual" 
                 className="max-h-48 mx-auto rounded shadow"
               />
             </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              name="titulo"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                name="tipo"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.tipo}
                onChange={handleChange}
              >
                 <option value="Noticia">Noticia</option>
                 <option value="Evento">Evento</option>
                 <option value="Convocatoria">Convocatoria</option>
                 <option value="Aviso">Aviso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="categoria"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.categoria}
                onChange={handleChange}
              >
                 {categorias.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cambiar Imagen (Opcional)</label>
            <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resumen</label>
            <textarea
              name="resumen"
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.resumen}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido Completo</label>
            <textarea
              name="contenido_completo"
              rows={8}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.contenido_completo}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="es_destacado"
              id="edit_destacado"
              className="h-4 w-4 text-blue-600"
              checked={formData.es_destacado}
              onChange={handleChange}
            />
            <label htmlFor="edit_destacado" className="ml-2 text-sm text-gray-900">Destacar noticia en portada</label>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}