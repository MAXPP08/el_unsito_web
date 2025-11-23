'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { Gaceta } from '@/types';

export default function GacetasPage() {
  const [gacetas, setGacetas] = useState<Gaceta[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear()
  });
  const [file, setFile] = useState<File | null>(null);

  //[cite_start]// [cite: 605] Cargar gacetas
  const fetchGacetas = async () => {
    try {
      const res = await api.get('/gacetas');
      setGacetas(res.data);
    } catch (error) {
      console.error("Error cargando gacetas:", error);
    }
  };

  useEffect(() => {
    fetchGacetas();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  //[cite_start]// [cite: 616] Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Debes seleccionar un archivo PDF");
    if (file.type !== 'application/pdf') return alert("El archivo debe ser PDF");
    
    setLoading(true);
    try {
      // 1. Subir archivo
      const uploadData = new FormData();
      uploadData.append('file', file);
      const uploadRes = await api.post('/upload', uploadData, {
         headers: { 'Content-Type': 'multipart/form-data' }
      });
      const pdfUrl = uploadRes.data.url;

      // 2. Crear registro
      await api.post('/gacetas', {
        ...formData,
        url_pdf: pdfUrl
      });

      alert("Gaceta publicada correctamente");
      setFile(null);
      setFormData({ ...formData, titulo: '' });
      // Limpiar input
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      fetchGacetas();
    } catch (error) {
      console.error(error);
      alert("Error al subir la gaceta");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Seguro que quieres eliminar esta gaceta?")) {
      try {
        await api.delete(`/gacetas/${id}`);
        setGacetas(gacetas.filter(g => g._id !== id));
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  const obtenerNombreMes = (numeroMes: number) => {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return meses[numeroMes - 1] || "Desconocido";
  };

  // Helper para URL de PDF
  const getPdfUrl = (url: string) => {
      if (url.startsWith('http')) return url;
      return `http://localhost:3000${url}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Gacetas</h2>
          <Link href="/dashboard">
            <button className="text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded bg-white">Volver al Panel</button>
          </Link>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow p-6 mb-10 border-l-4 border-red-800">
          <h3 className="text-xl font-semibold text-red-900 mb-4">Subir Nueva Gaceta</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título del Documento</label>
              <input
                type="text"
                name="titulo"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                placeholder="Ej: Gaceta Universitaria - Mayo 2025"
                value={formData.titulo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                <select name="mes" value={formData.mes} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2">
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>{obtenerNombreMes(i + 1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                <input type="number" name="ano" value={formData.ano} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Archivo PDF</label>
              <input id="fileInput" type="file" accept="application/pdf" onChange={handleFileChange} required className="w-full text-sm" />
            </div>

            <button type="submit" disabled={loading} className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800 font-bold">
              {loading ? 'Subiendo Documento...' : 'Publicar Gaceta'}
            </button>
          </form>
        </div>

        {/* Historial */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Historial de Publicaciones</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4">Periodo</th>
                <th className="p-4">Título</th>
                <th className="p-4">Archivo</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {gacetas.length === 0 ? (
                 <tr><td colSpan={4} className="p-6 text-center text-gray-500">No hay gacetas.</td></tr>
              ) : (
                gacetas.map(g => (
                  <tr key={g._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <span className="font-bold text-red-800 block">{obtenerNombreMes(g.mes)}</span>
                      <span className="text-gray-500 text-sm">{g.ano}</span>
                    </td>
                    <td className="p-4 font-medium">{g.titulo}</td>
                    <td className="p-4">
                      <a href={getPdfUrl(g.url_pdf)} target="_blank" rel="noreferrer" className="text-red-600 font-bold hover:underline flex items-center gap-1">
                        Ver PDF
                      </a>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(g._id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">
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
    </div>
  );
}