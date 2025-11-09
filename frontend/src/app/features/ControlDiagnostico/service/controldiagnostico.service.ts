import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, pipe } from 'rxjs';

import {
  ControlDiagnostico,
  CreateControlDiagnosticoDto,
  UpdateControlDiagnosticoDto,
} from '../model/controldiagnostico.model';
import {
  ApiResponse,
  PaginatedApiResponse,
  BasePaginationParams,
} from '../../../../core/API_Response-interfaces/api-response.model';

export interface ControlDiagnosticoFilters extends BasePaginationParams {
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ControldiagnosticoService {
  private getApiUrl(programaId: string) {
    return `http://localhost:3000/api/programas-diagnostico/${programaId}/controles`;
  }

  constructor(private http: HttpClient) {}

  listarControlesPorPrograma(
    programaId: string,
    filters: ControlDiagnosticoFilters = {}
  ): Observable<PaginatedApiResponse<ControlDiagnostico>> {
    let params = new HttpParams();
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio);
    if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin);
    if (filters.order) params = params.set('order', filters.order);

    return this.http.get<PaginatedApiResponse<ControlDiagnostico>>(
    this.getApiUrl(programaId),
    { params }
  );
  }

  obtenerControl(programaId: string, controlId: string): Observable<ControlDiagnostico> {
    return this.http
      .get<ApiResponse<ControlDiagnostico>>(`${this.getApiUrl(programaId)}/${controlId}`)
      .pipe(map((r) => r.data));
  }

  crearControl(
    programaId: string,
    dto: CreateControlDiagnosticoDto
  ): Observable<ControlDiagnostico> {
    return this.http
      .post<ApiResponse<ControlDiagnostico>>(this.getApiUrl(programaId), dto)
      .pipe(map((r) => r.data));
  }
  actualizarControl(
    programaId: string,
    controlId: string,
    dto: UpdateControlDiagnosticoDto
  ): Observable<ControlDiagnostico> {
    return this.http
      .put<ApiResponse<ControlDiagnostico>>(`${this.getApiUrl(programaId)}/${controlId}`, dto)
      .pipe(map((r) => r.data));
  }
}
