//[cite_start]// Basado en models/Categoria.js [cite: 1320]
export interface Categoria {
  _id: string;
  nombre: string;
}

//[cite_start]// Basado en models/Publicacion.js [cite: 1351]
export interface Publicacion {
  _id: string;
  titulo: string;
  resumen: string;
  contenido_completo: string;
  autor?: string;
  fecha_publicacion: string;
  es_destacado: boolean;
  tipo: 'Noticia' | 'Evento' | 'Convocatoria' | 'Aviso';
  // En tu backend a veces devuelves solo el ID y a veces el objeto populado
  categoria: Categoria | string; 
  imagen_principal_url: string;
  imagenes_carousel?: string[];
  adjuntos?: { titulo: string; url: string }[];
  fecha_evento_inicio?: string;
  fecha_evento_cierre?: string;
}

 //[cite_start]// Basado en models/Gaceta.js [cite: 1329]
export interface Gaceta {
  _id: string;
  titulo: string;
  mes: number;
  ano: number;
  url_pdf: string;
}