import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, pipe } from 'rxjs';

import { ControlDiagnostico, CreateControlDiagnosticoDto, UpdateControlDiagnosticoDto } from '../model/controldiagnostico.model';
import { ApiResponse } from '../../../../core/API_Response-interfaces/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ControldiagnosticoService {
  private getApiUrl(programaId:string){
    return `http://localhost:3000/api/programas-diagnostico/${programaId}/controles`;
  }

  constructor(private http: HttpClient) { }

  listarControlesPorPrograma(programaId: string): Observable<ControlDiagnostico[]> {
  return this.http
    .get<{ message: string; data: ControlDiagnostico[] }>(this.getApiUrl(programaId))
    .pipe(map((r) => r.data));
}

  obtenerControl(programaId: string, controlId: string): Observable<ControlDiagnostico> {
  return this.http
    .get<any>(`${this.getApiUrl(programaId)}/${controlId}`)
    .pipe(
      map((r) => {
        // Si la respuesta viene envuelta en { data: {...} }
        if (r && r.data) return r.data as ControlDiagnostico;
        // Si viene el objeto directamente
        return r as ControlDiagnostico;
      })
    );
  }

  crearControl(programaId: string, dto: CreateControlDiagnosticoDto): Observable<ControlDiagnostico> {
    return this.http
      .post<ApiResponse<ControlDiagnostico>>(this.getApiUrl(programaId), dto)
      .pipe(map((r) => r.data));
  }
  actualizarControl(programaId: string, controlId: string, dto: UpdateControlDiagnosticoDto): Observable<ControlDiagnostico> {
    return this.http
      .put<ApiResponse<ControlDiagnostico>>(
        `${this.getApiUrl(programaId)}/${controlId}`,
        dto
      )
      .pipe(map((r) => r.data));
  }

  
}
