import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface UserData {
  id_usuario: string;
  dni: string;
  nombre: string;
  apellido: string;
  rol: 'Obstetra' | 'Administrador';
  fecha_nacimiento: string; // Se recibe como string (YYYY-MM-DDTHH:mm:ss.sssZ)
  correo_electronico: string;
  telefono: string;
  numero_colegiatura: string;
  estado: 'A' | 'I'; // A: Activo, I: Inactivo
  direccion: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserObstetraService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient, private router: Router) {}

  listarObstetras(): Observable<UserData[]> {
    // Llama al endpoint ListarObstetras del backend
    return this.http.get<UserData[]>(this.apiUrl);
  }

  registrarUsuario(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }

  //obtiene los datos de un usuario por su ID

  getUsuarioById(id: string): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}/${id}`);
  }

  //Modificar usuario

  modificarUsuario(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData);
  }

  //Inhabilitar

  inhabilitarUsuario(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/inhabilitar`, {});
  }
}
