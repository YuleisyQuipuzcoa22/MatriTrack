export interface Analisis {
  id_analisis: string;
  nombre_analisis: string;
  descripcion_analisis: string | null;
  estado: 'A' | 'I';
}
