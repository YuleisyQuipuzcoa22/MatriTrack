import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ControlPuerperioData {
  id_control_puerperio: string;
  Programa_Puerperio_id_programapuerperio: string;
  fecha_controlpuerperio: string; // ISO date
  fecha_modificacion?: string | null;
  peso?: number | null;
  talla?: number | null;
  presion_arterial?: string | null;
  involucion_uterina?: string | null;
  cicatrizacion?: string | null;
  estado_mamas_lactancia?: string | null;
  estado_emocional?: string | null;
  observacion?: string | null;
  recomendacion?: string | null;
  usuario_id_usuario?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class Controlpuerperio {
  private apiUrl = 'http://localhost:3000/api/controles-puerperio';

  constructor(private http: HttpClient) {}

  listarControlesPorPrograma(programaId: string): Observable<ControlPuerperioData[]> {
    // el backend no tiene endpoint por programa, devolvemos todos y filtra el componente
    return this.http.get<any>(this.apiUrl).pipe(map(r => (r.data || r).filter((c: any) => c.id_programapuerperio === programaId)));
  }

  obtenerControl(id: string): Observable<ControlPuerperioData | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map(r => r.data || null));
  }

  crearControl(control: ControlPuerperioData): Observable<ControlPuerperioData> {
    const payload: any = {
      id_programapuerperio: control.Programa_Puerperio_id_programapuerperio,
      usuario_id_usuario: control['usuario_id_usuario'] || undefined,
      peso: control.peso,
      talla: control.talla,
      presion_arterial: control.presion_arterial,
      involucion_uterina: control.involucion_uterina,
      cicatrizacion: control.cicatrizacion,
      estado_mamas_lactancia: control.estado_mamas_lactancia,
      estado_emocional: control.estado_emocional,
      observacion: control.observacion,
      recomendacion: control.recomendacion,
    };
    return this.http.post<any>(this.apiUrl, payload).pipe(map(r => r.data || r));
  }

  actualizarControl(id: string, changes: Partial<ControlPuerperioData>): Observable<ControlPuerperioData | null> {
    const payload: any = { ...changes } as any;
    if ((changes as any).Programa_Puerperio_id_programapuerperio) payload.id_programapuerperio = (changes as any).Programa_Puerperio_id_programapuerperio;
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(map(r => r.data || null));
  }
}
