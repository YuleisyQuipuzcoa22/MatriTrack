import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

/**
 * Interfaz para el objeto de respuesta del usuario (para la Edición/Listado)
 */
export interface UserData {
  id_usuario: string; 
  dni: string;
  nombre: string;
  apellido: string;
  rol: 'Obstetra' | 'Administrador';
  fecha_nacimiento: string; // Se recibe como string (YYYY-MM-DD)
  correo_electronico: string;
  telefono: string;
  colegiatura: string;
  estado: 'A' | 'I';
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient, private router: Router) {}

  // =====================================================================================
  // 1. AUTENTICACIÓN
  // =====================================================================================

  login(dni: string, contrasena: string, recaptchaToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { dni, contrasena, recaptchaToken}).pipe(
      tap((response) => {
        console.log('ROL RECIBIDO:', response.rol);
        // Utilizamos localStorage, pero lo ideal en un proyecto de sistemas es usar 
        // Cookies HTTP-Only por seguridad.
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_role', response.rol);
      })
    );
  }

  // ... (getToken, getRole, isLoggedIn, logout, generateSimplePassword) ...

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    this.router.navigate(['/login']);
  }

  generateSimplePassword(): string {
    const length = 8; // Contraseña de 8 caracteres
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    let password = '';

    // Aseguramos al menos un número y un caracter especial para cumplir con la mínima complejidad
    password += this.getRandomChar('0123456789');
    password += this.getRandomChar('!@#$');

    // Rellenamos el resto
    for (let i = 2; i < length; i++) {
      password += this.getRandomChar(chars);
    }

    // Mezclamos la cadena para evitar patrones predecibles
    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }

  private getRandomChar(charSet: string): string {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet.charAt(randomIndex);
  }


}
