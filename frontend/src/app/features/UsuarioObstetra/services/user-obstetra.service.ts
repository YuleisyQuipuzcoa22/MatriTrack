import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import {
  ApiResponse,
  BasePaginationParams,
  PaginatedApiResponse,
} from '../../../../core/API_Response-interfaces/api-response.model';

export interface UserData {
  id_usuario: string;
  dni: string;
  nombre: string;
  apellido: string;
  rol: 'Obstetra' | 'Administrador';
  fecha_nacimiento: string;
  correo_electronico: string;
  telefono: string;
  numero_colegiatura: string;
  estado: 'A' | 'I';
  direccion: string;
}
export interface UsuarioFilters extends BasePaginationParams {
  nombreApellido?: string;
  dni?: string;
  estado?: 'A' | 'I';
}

@Injectable({
  providedIn: 'root',
})
export class UserObstetraService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient, private router: Router) {}

  listarObstetras(filters?: UsuarioFilters): Observable<PaginatedApiResponse<UserData>> {
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
    return this.http.get<PaginatedApiResponse<UserData>>(this.apiUrl, { params });
  }

  registrarUsuario(userData: any): Observable<any> {
    return this.http
      .post<ApiResponse<any>>(this.apiUrl, userData)
      .pipe(map((response) => response.data));
  }

  getUsuarioById(id: string): Observable<UserData> {
    return this.http
      .get<ApiResponse<UserData>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  modificarUsuario(id: string, userData: any): Observable<any> {
    return this.http
      .put<ApiResponse<any>>(`${this.apiUrl}/${id}`, userData)
      .pipe(map((response) => response.data));
  }

  inhabilitarUsuario(id: string): Observable<any> {
    return this.http
      .put<ApiResponse<any>>(`${this.apiUrl}/${id}/inhabilitar`, {})
      .pipe(map((response) => response.data));
  }
}
