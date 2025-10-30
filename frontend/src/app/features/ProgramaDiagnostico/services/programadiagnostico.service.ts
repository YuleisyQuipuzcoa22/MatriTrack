import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  ProgramaDiagnostico,
  FinalizarProgramaDiagnosticoDto,
  Estado,
} from '../model/programadiagnostico';
import {
  ApiResponse,
  BasePaginationParams,
  PaginatedApiResponse,
} from '../../../../core/API_Response-interfaces/api-response.model';

export interface ProgramaDiagnosticoFilters extends BasePaginationParams {
  nombreApellido?: string;
  dni?: string;
  estadoPaciente?: 'ACTIVO' | 'INACTIVO';
  estadoPrograma?: 'ACTIVO' | 'FINALIZADO';
}

@Injectable({
  providedIn: 'root',
})
export class ProgramaDiagnosticoService {
  private apiUrl = 'http://localhost:3000/api/programas-diagnostico';

  constructor(private http: HttpClient) {}

  listarProgramas(
    filters?: ProgramaDiagnosticoFilters
  ): Observable<PaginatedApiResponse<ProgramaDiagnostico>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.nombreApellido) params = params.set('nombreApellido', filters.nombreApellido);
      if (filters.dni) params = params.set('dni', filters.dni);
      if (filters.estadoPaciente) params = params.set('estadoPaciente', filters.estadoPaciente);
      if (filters.estadoPrograma) params = params.set('estadoPrograma', filters.estadoPrograma);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.order) params = params.set('order', filters.order);
    }
    return this.http.get<PaginatedApiResponse<ProgramaDiagnostico>>(this.apiUrl, { params });
  }

  getProgramaById(id_programa: string): Observable<ProgramaDiagnostico> {
    return this.http
      .get<ApiResponse<ProgramaDiagnostico>>(`${this.apiUrl}/${id_programa}`)
      .pipe(map((response) => response.data));
  }

  createPrograma(id_historial: string, dto: any): Observable<ProgramaDiagnostico> {
    return this.http
      .post<ApiResponse<ProgramaDiagnostico>>(`${this.apiUrl}/historial/${id_historial}`, dto)
      .pipe(map((response) => response.data));
  }

  updatePrograma(id_programa: string, dto: any): Observable<ProgramaDiagnostico> {
    // Utiliza el método PUT o PATCH
    return this.http
      .patch<ApiResponse<ProgramaDiagnostico>>(`${this.apiUrl}/${id_programa}`, dto)
      .pipe(map((response) => response.data));
  }

  /**
   * Finaliza un programa de diagnóstico.
   * @param id_programa El ID del programa a finalizar.
   * @param dto Los datos de finalización (motivo).
   */
  finalizar(
    id_programa: string,
    dto: FinalizarProgramaDiagnosticoDto
  ): Observable<ProgramaDiagnostico> {
    // Asume un endpoint específico para la acción de finalizar
    return this.http
      .patch<ApiResponse<ProgramaDiagnostico>>(`${this.apiUrl}/${id_programa}/finalizar`, dto)
      .pipe(map((response) => response.data));
  }

  //Activa/Habilita un programa que estaba inactivo o finalizado.

  activar(id_programa: string): Observable<ProgramaDiagnostico> {
    // Asume un endpoint específico para la acción de activar/habilitar
    return this.http
      .patch<ApiResponse<ProgramaDiagnostico>>(`${this.apiUrl}/${id_programa}/activar`, {})
      .pipe(map((response) => response.data));
  }
}
