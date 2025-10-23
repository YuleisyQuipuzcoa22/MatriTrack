import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class Controlpuerperio {
  private data: ControlPuerperioData[] = [
    {
      id_control_puerperio: 'C00001',
      Programa_Puerperio_id_programapuerperio: 'P000001',
      fecha_controlpuerperio: '2025-10-02',
      fecha_modificacion: null,
      peso: 62.5,
      talla: 1.63,
      presion_arterial: '120/80',
      involucion_uterina: 'Adecuada',
      cicatrizacion: 'Normal',
      estado_mamas_lactancia: 'Buena',
      estado_emocional: 'Estable',
      observacion: 'Sin complicaciones',
      recomendacion: 'Control en 7 días'
    },
    {
      id_control_puerperio: 'C00002',
      Programa_Puerperio_id_programapuerperio: 'P000001',
      fecha_controlpuerperio: '2025-10-09',
      fecha_modificacion: null,
      peso: 61.0,
      talla: 1.63,
      presion_arterial: '118/76',
      involucion_uterina: 'Normal',
      cicatrizacion: 'Leve eritema',
      estado_mamas_lactancia: 'Lactancia estable',
      estado_emocional: 'Leve ansiedad',
      observacion: 'Recomendado seguimiento psicológico',
      recomendacion: 'Control 14 días'
    }
  ];

  listarControlesPorPrograma(programaId: string): Observable<ControlPuerperioData[]> {
    const list = this.data.filter(d => d.Programa_Puerperio_id_programapuerperio === programaId);
    return of([...list]);
  }

  obtenerControl(id: string): Observable<ControlPuerperioData | null> {
    const item = this.data.find(d => d.id_control_puerperio === id) || null;
    return of(item);
  }

  crearControl(control: ControlPuerperioData): Observable<ControlPuerperioData> {
    // generar id simple
    if (!control.id_control_puerperio) {
      const next = (this.data.length + 1).toString().padStart(5, '0');
      control.id_control_puerperio = 'C' + next;
    }
    this.data.push({ ...control });
    return of(control);
  }

  actualizarControl(id: string, changes: Partial<ControlPuerperioData>): Observable<ControlPuerperioData | null> {
    const idx = this.data.findIndex(d => d.id_control_puerperio === id);
    if (idx === -1) return of(null);
    this.data[idx] = { ...this.data[idx], ...changes };
    return of(this.data[idx]);
  }
}
