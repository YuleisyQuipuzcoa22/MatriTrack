import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient, private router: Router) {}

  login(dni: string, contrasena: string, recaptchaToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { dni, contrasena, recaptchaToken }).pipe(
      tap((response) => {
        console.log('Login exitoso. Token y rol guardados.');
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_role', response.rol);
        // Guardamos nombre y apellido para el sidebar
        localStorage.setItem('user_first_name', response.nombre);
        localStorage.setItem('user_last_name', response.apellido)      
      })
    );
  }
  private getItem(key: string): string | null {
    if (typeof window === 'undefined') return null; // SSR safety
    return localStorage.getItem(key);
  }

  getToken(): string | null {
    return this.getItem('auth_token');
  }

  getRole(): string | null {
    return this.getItem('user_role');
  }

  getFirstName(): string | null {
    return this.getItem('user_first_name');
  }

  getLastName(): string | null {
    return this.getItem('user_last_name');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Usamos el token solo para validar la expiración, NO para obtener el ID.
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const isValid = Date.now() < exp;

      if (!isValid) {
        console.warn('Token expirado. Limpiando sesión...');
        this.logout();
      }

      return isValid;
    } catch (error) {
      console.error(' Error al validar token:', error);
      this.logout();
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_first_name');
    localStorage.removeItem('user_last_name');

    this.router.navigate(['/login']);
  }

  generateSimplePassword(): string {
    const length = 8;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    let password = '';

    password += this.getRandomChar('0123456789');
    password += this.getRandomChar('!@#$');

    for (let i = 2; i < length; i++) {
      password += this.getRandomChar(chars);
    }

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
