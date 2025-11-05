// src/app/features/Puerperio/ControlPuerperio/service/controlpuerperio.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ControlPuerperio,
  CreateControlPuerperioDto,
  UpdateControlPuerperioDto,
} from '../model/controlpuerperio.model';
import { ApiResponse } from '../../../../../core/API_Response-interfaces/api-response.model';

@Injectable({
  providedIn: 'root',
})
// He renombrado la clase a "ControlpuerperioService" para seguir la convención de Angular.
export class ControlpuerperioService { 
  
  // La API base para controles está anidada dentro de los programas
  private getApiUrl(programaId: string) {
    // Esta es la ruta correcta del backend
    return `http://localhost:3000/api/programas-puerperio/${programaId}/controles`;
  }

  constructor(private http: HttpClient) {}

  listarControlesPorPrograma(
    programaId: string
  ): Observable<ControlPuerperio[]> {
    // CORREGIDO: Ahora llama al endpoint correcto que devuelve solo
    // los controles de ese programa.
    return this.http
      .get<ApiResponse<ControlPuerperio[]>>(this.getApiUrl(programaId))
      .pipe(map((r) => r.data));
  }

  obtenerControl(
    programaId: string,
    controlId: string
  ): Observable<ControlPuerperio> {
    return this.http
      .get<ApiResponse<ControlPuerperio>>(
        `${this.getApiUrl(programaId)}/${controlId}`
      )
      .pipe(map((r) => r.data));
  }

  crearControl(
    programaId: string,
    dto: CreateControlPuerperioDto
  ): Observable<ControlPuerperio> {
    // No necesitamos enviar 'usuario_id_usuario', el backend lo toma del token.
    return this.http
      .post<ApiResponse<ControlPuerperio>>(this.getApiUrl(programaId), dto)
      .pipe(map((r) => r.data));
  }

  actualizarControl(
    programaId: string,
    controlId: string,
    dto: UpdateControlPuerperioDto
  ): Observable<ControlPuerperio> {
    return this.http
      .put<ApiResponse<ControlPuerperio>>(
        `${this.getApiUrl(programaId)}/${controlId}`,
        dto
      )
      .pipe(map((r) => r.data));
  }
}