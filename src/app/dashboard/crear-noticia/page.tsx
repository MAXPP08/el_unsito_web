'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Categoria } from '@/types';
// Importamos la lógica de Firebase que configuramos
import { uploadImage } from '@/lib/storage-service'; 

export default function CreateNewsPage() {
  const navigate = useRouter();
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    contenido_completo: '',
    tipo: 'Noticia',
    categoria: '',
    es_destacado: false
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get('/categorias');
        setCategorias(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, categoria: res.data[0]._id }));
        }
      } catch (error) {
        setMessage({ text: 'No se pudieron cargar las categorías.', type: 'error' });
      }
    };
    fetchCategorias();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    // Validación de categoría
    if (!formData.categoria) {
      setMessage({ text: 'Error: Espera a que carguen las categorías.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      let imagenUrl = '';

      // 1. SUBIDA A FIREBASE STORAGE
      if (file) {
        setMessage({ text: 'Subiendo imagen a Firebase...', type: 'info' });
        imagenUrl = await uploadImage(file); 
        console.log("URL de Firebase obtenida:", imagenUrl);
      } else {
        alert("La imagen principal es obligatoria");
        setLoading(false);
        return;
      }

      // 2. PREPARACIÓN DEL PAYLOAD (JSON)
      const payload = {
        ...formData,
        imagen_principal_url: imagenUrl, // Link de la nube
        imagenes_carousel: [],
        adjuntos: []
      };

      // 3. ENVÍO AL BACKEND CON TOKEN DE AUTORIZACIÓN (Solución al 401)
      // Recuperamos el token que guardaste en el login
      const token = localStorage.getItem('token'); 

      await api.post('/publicaciones', payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setMessage({ text: '¡Noticia publicada correctamente!', type: 'success' });
      
      // Redirección tras éxito
      setTimeout(() => navigate.push('/dashboard'), 2000);

    } catch (error: any) {
      console.error("Error en el proceso:", error);
      
      // Manejo específico del error 401
      if (error.response?.status === 401) {
        setMessage({ 
          text: 'Sesión no válida. Por favor, vuelve a iniciar sesión.', 
          type: 'error' 
        });
      } else {
        const errorTexto = error.response?.data?.mensaje || 'Error al crear la publicación.';
        setMessage({ text: errorTexto, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Crear Nueva Publicación</h2>
          <Link href="/dashboard">
            <button className="text-gray-500 hover:text-red-500 font-medium">X Cancelar</button>
          </Link>
        </div>

        {/* Alertas dinámicas */}
        {message.text && (
          <div className={`mb-4 p-3 rounded ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 
            message.type === 'info' ? 'bg-blue-100 text-blue-700' : 
            'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título de la publicación</label>
            <input
              type="text"
              name="titulo"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Escribe un título llamativo..."
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Fila Doble: Tipo y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                name="tipo"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={formData.categoria}
                onChange={handleChange}
              >
                <option value="">-- Selecciona una --</option>
                {categorias.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Imagen de Portada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de Portada</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            <small className="text-gray-400 mt-1 block">La imagen se guardará en Google Cloud Storage.</small>
          </div>

          {/* Resumen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resumen Corto</label>
            <textarea
              name="resumen"
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Breve descripción..."
              value={formData.resumen}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contenido Completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido Completo</label>
            <textarea
              name="contenido_completo"
              rows={8}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Desarrolla toda la información aquí..."
              value={formData.contenido_completo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Destacado */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="es_destacado"
              id="es_destacado"
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              checked={formData.es_destacado}
              onChange={handleChange}
            />
            <label htmlFor="es_destacado" className="ml-2 block text-sm text-gray-900">
              Destacar esta noticia en el carrusel principal
            </label>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded text-white font-bold shadow transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? 'Procesando con Firebase...' : 'Publicar Ahora'}
          </button>
        </form>
      </div>
    </div>
  );
}