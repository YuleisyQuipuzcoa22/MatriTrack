import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { PacienteData } from '../model/paciente-historial';



// ⭐ Interfaz para la respuesta del backend
interface ApiResponse<T> {
  message: string;
  data: T;
  total?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private apiUrl = 'http://localhost:3000/api/pacientes';

  constructor(private http: HttpClient, private router: Router) {}

  listarPacientes(): Observable<PacienteData[]> {
    return this.http
      .get<ApiResponse<PacienteData[]>>(this.apiUrl)
      .pipe(map((response) => response.data)); // Extrae solo el data
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
}