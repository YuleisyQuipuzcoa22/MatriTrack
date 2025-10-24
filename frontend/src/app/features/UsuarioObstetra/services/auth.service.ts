import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';

interface LoginResponse {
  message: string;
  data: {
    token: string;
    rol: string;
    nombre: string;
    apellido: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient, private router: Router) {}

  login(dni: string, contrasena: string, recaptchaToken: string): Observable<any> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { dni, contrasena, recaptchaToken })
      .pipe(
        map((response) => response.data), // ⭐ Extrae el data
        tap((data) => {
          console.log('Login exitoso. Token y rol guardados.');
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user_role', data.rol);
          localStorage.setItem('user_first_name', data.nombre);
          localStorage.setItem('user_last_name', data.apellido);
        })
      );
  }

  private getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
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
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const isValid = Date.now() < exp;

      if (!isValid) {
        console.warn('Token expirado. Limpiando sesión...');
        this.logout();
      }

      return isValid;
    } catch (error) {
      console.error('Error al validar token:', error);
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

    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  private getRandomChar(charSet: string): string {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet.charAt(randomIndex);
  }

  private getDecodedTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // El payload es la segunda parte del token JWT (índice 1)
      const payloadBase64 = token.split('.')[1];
      return JSON.parse(atob(payloadBase64));
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }

  // MÉTODO CLAVE: Obtiene el ID del usuario
  getCurrentUserId(): string | null {
    const payload = this.getDecodedTokenPayload();
    
    if (payload) {
        // **IMPORTANTE**: Reemplaza 'userId' con el nombre del campo 
        // que tu backend usa para el ID de usuario en el payload del JWT (ej: 'sub', 'id_usuario', 'userId').
        const userIdKey = 'id_usuario'; // <-- Asumiendo que tu backend usa 'id_usuario'
        
        return payload[userIdKey] || null;
    }
    return null;
  }



}