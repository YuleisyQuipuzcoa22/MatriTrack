// src/app/features/Puerperio/ControlPuerperio/service/controlpuerperio.service.ts
import { HttpClient, HttpParams } from '@angular/common/http'; // 1. Importar HttpParams
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ControlPuerperio,
  CreateControlPuerperioDto,
  UpdateControlPuerperioDto,
} from '../model/controlpuerperio.model';
import {
  ApiResponse,
  PaginatedApiResponse, // 2. Importar
  BasePaginationParams, // 2. Importar
} from '../../../../../core/API_Response-interfaces/api-response.model';

// 3. Crear interfaz de filtros
export interface ControlPuerperioFilters extends BasePaginationParams {
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable({
  providedIn: 'root',
})
// He renombrado la clase a "ControlpuerperioService" para seguir la convención de Angular.
export class ControlpuerperioService {
  // La API base para controles está anidada dentro de los programas
  private getApiUrl(programaId: string) {
    // Esta es la ruta correcta del backend
    return `http://localhost:3000/api/programas-puerperio/${programaId}/controles`;
  }

  constructor(private http: HttpClient) {}

  // 4. Modificar listarControlesPorPrograma
  listarControlesPorPrograma(
    programaId: string,
    filters: ControlPuerperioFilters = {}, // Aceptar filtros
  ): Observable<PaginatedApiResponse<ControlPuerperio>> {
    // Devolver PaginatedApiResponse

    let params = new HttpParams();
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.fechaInicio)
      params = params.set('fechaInicio', filters.fechaInicio);
    if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin);
    if (filters.order) params = params.set('order', filters.order);

    return this.http
      .get<PaginatedApiResponse<ControlPuerperio>>(this.getApiUrl(programaId), {
        params,
      })
      .pipe(map((r) => r)); // El backend ya devuelve { message, data, meta }
  }

  obtenerControl(
    programaId: string,
    controlId: string,
  ): Observable<ControlPuerperio> {
    return this.http
      .get<ApiResponse<ControlPuerperio>>(
        `${this.getApiUrl(programaId)}/${controlId}`,
      )
      .pipe(map((r) => r.data));
  }

  crearControl(
    programaId: string,
    dto: CreateControlPuerperioDto,
  ): Observable<ControlPuerperio> {
    // No necesitamos enviar 'usuario_id_usuario', el backend lo toma del token.
    return this.http
      .post<ApiResponse<ControlPuerperio>>(this.getApiUrl(programaId), dto)
      .pipe(map((r) => r.data));
  }

  actualizarControl(
    programaId: string,
    controlId: string,
    dto: UpdateControlPuerperioDto,
  ): Observable<ControlPuerperio> {
    return this.http
      .put<ApiResponse<ControlPuerperio>>(
        `${this.getApiUrl(programaId)}/${controlId}`,
        dto,
      )
      .pipe(map((r) => r.data));
  }
}