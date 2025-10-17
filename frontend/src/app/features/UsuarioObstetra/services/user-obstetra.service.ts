import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

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

interface ApiResponse<T> {
  message: string;
  data: T;
  total?: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserObstetraService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient, private router: Router) {}

  listarObstetras(): Observable<UserData[]> {
    return this.http
      .get<ApiResponse<UserData[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
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