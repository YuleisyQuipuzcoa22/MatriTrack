import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ProgramapuerperioData {
  id_programapuerperio: string;
  HistorialMedico_id_historialmedico: string;
  fecha_inicio: string; // ISO date
  tipo_parto: 'NATURAL' | 'CESAREA';
  observacion: string;
  complicacion: string;
  estado: 'A' | 'I' | 'F'; // A=Activo, I=Inactivo, F=Finalizado
  fecha_finalizacion?: string | null;
  motivo_finalizacion?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class Programapuerperio {
  private apiUrl = 'http://localhost:3000/api/programas-puerperio';

  constructor(private http: HttpClient) {}

  listarProgramas(): Observable<ProgramapuerperioData[]> {
    // El backend actual no expone un listado global en este primer paso,
    // si lo necesitas lo puedo implementar. Por ahora hace GET básico a la url.
    return this.http.get<any>(this.apiUrl).pipe(map(r => r.data || r));
  }

  obtenerPrograma(id: string): Observable<ProgramapuerperioData | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map(r => r.data || null));
  }

  crearPrograma(p: ProgramapuerperioData): Observable<ProgramapuerperioData> {
    // Mapear nombre de campo del frontend al backend: HistorialMedico_id_historialmedico -> id_historialmedico
    const payload: any = {
      id_historialmedico: p.HistorialMedico_id_historialmedico,
      tipo_parto: p.tipo_parto,
      observacion: p.observacion,
      complicacion: p.complicacion,
    };
    return this.http.post<any>(this.apiUrl, payload).pipe(map(r => r.data || r));
  }

  actualizarPrograma(id: string, changes: Partial<ProgramapuerperioData>): Observable<ProgramapuerperioData | null> {
    // Backend actual no tiene PUT implementado en esta PR; si lo necesitas lo agrego.
    const payload: any = { ...changes } as any;
    if (changes.HistorialMedico_id_historialmedico) payload.id_historialmedico = changes.HistorialMedico_id_historialmedico;
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(map(r => r.data || null));
  }
}
