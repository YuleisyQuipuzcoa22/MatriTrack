import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { PacienteData } from '../model/paciente-historial';
import {
  ApiResponse,
  BasePaginationParams,
  PaginatedApiResponse,
} from '../../../../core/API_Response-interfaces/api-response.model';

export interface PacienteFilters extends BasePaginationParams {
  nombreApellido?: string;
  dni?: string;
  estado?: 'A' | 'I';
}

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private apiUrl = 'http://localhost:3000/api/pacientes';

  constructor(private http: HttpClient, private router: Router) {}

  listarPacientes(filters?: PacienteFilters): Observable<PaginatedApiResponse<PacienteData>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.nombreApellido) params = params.set('nombreApellido', filters.nombreApellido);
      if (filters.dni) params = params.set('dni', filters.dni);
      if (filters.estado) params = params.set('estado', filters.estado);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.order) params = params.set('order', filters.order);
    }
    return this.http.get<PaginatedApiResponse<PacienteData>>(this.apiUrl, { params });
  }

  registrarPaciente(pacienteData: any): Observable<PacienteData> {
    return this.http
      .post<ApiResponse<PacienteData>>(this.apiUrl, pacienteData)
      .pipe(map((response) => response.data));
  }

  getPacienteById(id: string): Observable<PacienteData> {
    return this.http
      .get<ApiResponse<PacienteData>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  modificarPaciente(id: string, pacienteData: any): Observable<PacienteData> {
    return this.http
      .put<ApiResponse<PacienteData>>(`${this.apiUrl}/${id}`, pacienteData)
      .pipe(map((response) => response.data));
  }

  inhabilitarPaciente(id: string): Observable<PacienteData> {
    return this.http
      .patch<ApiResponse<PacienteData>>(`${this.apiUrl}/${id}/inhabilitar`, {})
      .pipe(map((response) => response.data));
  }

  /**NUEVO */
  buscarPacientePorDni(dni: string): Observable<PacienteData | null> {
    let params = new HttpParams().set('dni', dni).set('estado', 'A');

    return this.http.get<PaginatedApiResponse<PacienteData>>(this.apiUrl, { params }).pipe(
      map((response) => {
        if (response.data && response.data.length > 0) {
          return response.data[0];
        }
        return null;
      })
    );
  }
  getHistorialIdByDni(dni: string): Observable<string | null> {
    return this.buscarPacientePorDni(dni).pipe(
      map((pacienteData) => {
        const data: any = pacienteData;
        if (data && data.historialMedico && data.historialMedico.id_historialmedico) {
          return data.historialMedico.id_historialmedico as string;
        }
        return null;
      })
    );
  }
}
