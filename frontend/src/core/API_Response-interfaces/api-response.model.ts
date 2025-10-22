//respuesta estándar de la API para operaciones individuales
export interface ApiResponse<T> {
  message: string;
  data: T;
}


//respuesta de api con paginación (para get - listado con paginación)

export interface PaginatedApiResponse<T> {
  message: string;
  data: T[];
  meta: PaginationMeta;
}

//metadata de paginación
export interface PaginationMeta {
  total: number;          // Total de registros en la BD
  page: number;           // Página actual
  limit: number;          // Registros por página
  totalPages: number;     // Total de páginas
  hasNextPage: boolean;   // ¿Hay página siguiente?
  hasPrevPage: boolean;   // ¿Hay página anterior?
}

//parametros base para paginación
//extender esta interfaz para filtros específicos de paginacion
export interface BasePaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}