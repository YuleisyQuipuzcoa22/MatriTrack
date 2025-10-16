import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// Usamos numero_colegiatura para ser consistentes con el campo de la BD
export interface UserData {
  id_usuario: string;
  dni: string;
  nombre: string;
  apellido: string;
  rol: 'Obstetra' | 'Administrador';
  fecha_nacimiento: string; // Se recibe como string (YYYY-MM-DDTHH:mm:ss.sssZ)
  correo_electronico: string;
  telefono: string;
  numero_colegiatura: string; // <-- Corregido para ser consistente con el backend
  estado: 'A' | 'I'; // A: Activo, I: Inactivo
}

@Injectable({
  providedIn: 'root',
})
export class UserObstetraService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient, private router: Router) {}

  // =====================================================================================
  // 2. GESTIÓN DE USUARIOS (CRUD del Admin)
  // =====================================================================================

  /**
   * RF2: GET /api/usuarios (Listar Obstetras y Administradores)
   */
  listarObstetras(): Observable<UserData[]> {
    // Llama al endpoint ListarObstetras del backend
    return this.http.get<UserData[]>(this.apiUrl);
  }

  // RF5: POST /api/usuarios
  registrarUsuario(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }

  /**
   * RF6: Obtiene los datos de un usuario por su ID (GET /api/usuarios/:id)
   */
  getUsuarioById(id: string): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}/${id}`);
  }

  /**
   * RF3/RF4: PUT /api/usuarios/:id (Modificar usuario)
   */
  modificarUsuario(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData);
  }

  /**
   * RF8: Inhabilitar (PUT /api/usuarios/:id/inhabilitar)
   */
  inhabilitarUsuario(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/inhabilitar`, {});
  }
}
