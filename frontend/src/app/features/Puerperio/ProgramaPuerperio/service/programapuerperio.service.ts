// src/app/features/Puerperio/ProgramaPuerperio/service/programapuerperio.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ApiResponse,
  BasePaginationParams,
  PaginatedApiResponse,
} from '../../../../../core/API_Response-interfaces/api-response.model';
import {
  ProgramaPuerperio,
  CreateProgramaPuerperioDto,
  UpdateProgramaPuerperioDto,
  FinalizarProgramaPuerperioDto,
  PacienteParaPuerperio,
} from '../model/programapuerperio.model';

// Interfaz para los filtros (igual que en Diagnóstico)
export interface ProgramaPuerperioFilters extends BasePaginationParams {
  nombreApellido?: string;
  dni?: string;
  estadoPaciente?: 'ACTIVO' | 'INACTIVO';
  estadoPrograma?: 'ACTIVO' | 'FINALIZADO';
}

@Injectable({
  providedIn: 'root',
})
export class ProgramapuerperioService {
  private apiUrl = 'http://localhost:3000/api/programas-puerperio';

  constructor(private http: HttpClient) {}

  listarProgramas(
    filters?: ProgramaPuerperioFilters
  ): Observable<PaginatedApiResponse<ProgramaPuerperio>> {
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
    return this.http.get<PaginatedApiResponse<ProgramaPuerperio>>(this.apiUrl, { params });
  }

  getProgramaById(id: string): Observable<ProgramaPuerperio> {
    return this.http
      .get<ApiResponse<ProgramaPuerperio>>(`${this.apiUrl}/${id}`)
      .pipe(map((r) => r.data));
  }

  // Nuevo endpoint para buscar pacientes que dieron a luz
  getPacientesDisponibles(busqueda?: string): Observable<PacienteParaPuerperio[]> {
    let params = new HttpParams();
    if (busqueda) {
      params = params.set('busqueda', busqueda);
    }
    return this.http
      .get<ApiResponse<PacienteParaPuerperio[]>>(`${this.apiUrl}/disponibles/pacientes`, { params })
      .pipe(map((r) => r.data));
  }

  createPrograma(
    id_historialmedico: string,
    dto: CreateProgramaPuerperioDto
  ): Observable<ProgramaPuerperio> {
    // La ruta es anidada al historial
    return this.http
      .post<ApiResponse<ProgramaPuerperio>>(`${this.apiUrl}/historial/${id_historialmedico}`, dto)
      .pipe(map((r) => r.data));
  }

  updatePrograma(
    id: string,
    dto: UpdateProgramaPuerperioDto
  ): Observable<ProgramaPuerperio> {
    return this.http
      .put<ApiResponse<ProgramaPuerperio>>(`${this.apiUrl}/${id}`, dto)
      .pipe(map((r) => r.data));
  }

  finalizar(
    id: string,
    dto: FinalizarProgramaPuerperioDto
  ): Observable<ProgramaPuerperio> {
    return this.http
      .patch<ApiResponse<ProgramaPuerperio>>(`${this.apiUrl}/${id}/finalizar`, dto)
      .pipe(map((r) => r.data));
  }

  activar(id: string): Observable<ProgramaPuerperio> {
    return this.http
      .patch<ApiResponse<ProgramaPuerperio>>(`${this.apiUrl}/${id}/activar`, {})
      .pipe(map((r) => r.data));
  }
}