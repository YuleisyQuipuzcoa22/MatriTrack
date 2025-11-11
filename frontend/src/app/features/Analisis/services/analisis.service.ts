import { Injectable } from '@angular/core';
import {
  ApiResponse,
  BasePaginationParams,
  PaginatedApiResponse,
} from '../../../../core/API_Response-interfaces/api-response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { Analisis } from '../model/analisis';
import { response } from 'express';

export interface AnalisisFilters extends BasePaginationParams {
  nombreAnalisis?: string;
  estado?: 'A' | 'I';
}

@Injectable({
  providedIn: 'root',
})
export class AnalisisService {
  private apiUrl = 'http://localhost:3000/api/analisis';
  constructor(private http: HttpClient, private router: Router) {}

  listarAnalisis(filters?: AnalisisFilters): Observable<PaginatedApiResponse<Analisis>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.nombreAnalisis) params = params.set('nombreAnalisis', filters.nombreAnalisis);
      if (filters.estado) params = params.set('estado', filters.estado);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.order) params = params.set('order', filters.order);
    }
    return this.http.get<PaginatedApiResponse<Analisis>>(this.apiUrl, { params });
  }

  registrarAnalisis(analisisData: any): Observable<Analisis> {
    return this.http
      .post<ApiResponse<Analisis>>(this.apiUrl, analisisData)
      .pipe(map((response) => response.data));
  }
  getAnalisisById(id: string): Observable<Analisis> {
    return this.http
      .get<ApiResponse<Analisis>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }
  modificarAnalisis(id: string, analisisData: any): Observable<Analisis> {
    return this.http
      .put<ApiResponse<Analisis>>(`${this.apiUrl}/${id}`, analisisData)
      .pipe(map((response) => response.data));
  }

  inhabilitarAnalisis(id: string): Observable<Analisis> {
    return this.http
      .patch<ApiResponse<Analisis>>(`${this.apiUrl}/${id}`, {})
      .pipe(map((response) => response.data));
  }

  listarTodosAnalisis(): Observable<Analisis[]> {
    const params = new HttpParams()
      .set('limit', 1000) // Un límite alto para traer todos
      .set('estado', 'A');  // Solo análisis activos
      
    return this.http.get<PaginatedApiResponse<Analisis>>(this.apiUrl, { params }).pipe(
      map(response => response.data) 
    );
  }

}
