import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ProgramapuerperioData {
  id_programapuerperio: string;
  HistorialMedico_id_historialmedico: string;
  fecha_inicio: string; // ISO date
  tipo_parto: string;
  observacion: string;
  complicacion: string;
  estado: string; // 'A'|'I' etc
  fecha_finalizacion?: string | null;
  motivo_finalizacion?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class Programapuerperio {
  private data: ProgramapuerperioData[] = [
    {
      id_programapuerperio: 'P000001',
      HistorialMedico_id_historialmedico: 'H00001',
      fecha_inicio: '2025-10-01',
      tipo_parto: 'Vaginal',
      observacion: 'Paciente estable, buen estado general',
      complicacion: 'Ninguna',
      estado: 'A',
      fecha_finalizacion: null,
      motivo_finalizacion: null,
    },
    {
      id_programapuerperio: 'P000002',
      HistorialMedico_id_historialmedico: 'H00002',
      fecha_inicio: '2025-09-20',
      tipo_parto: 'Cesárea',
      observacion: 'Control por hemorragia leve',
      complicacion: 'Hemorragia',
      estado: 'I',
      fecha_finalizacion: '2025-10-05',
      motivo_finalizacion: 'Alta médica',
    },
  ];

  // Método mock que devuelve un listado de programas de puerperio
  listarProgramas(): Observable<ProgramapuerperioData[]> {
    return of([...this.data]);
  }

  // Obtener un programa por su id (mock)
  obtenerPrograma(id: string): Observable<ProgramapuerperioData | null> {
    const found = this.data.find((p) => p.id_programapuerperio === id) || null;
    return of(found);
  }

  // Crear nuevo programa (mock)
  crearPrograma(p: ProgramapuerperioData): Observable<ProgramapuerperioData> {
    // Generar id simple si no viene
    if (!p.id_programapuerperio) {
      const next = (this.data.length + 1).toString().padStart(6, '0');
      p.id_programapuerperio = 'P' + next;
    }
    this.data.push({ ...p });
    return of(p);
  }

  // Actualizar programa (mock)
  actualizarPrograma(id: string, changes: Partial<ProgramapuerperioData>): Observable<ProgramapuerperioData | null> {
    const idx = this.data.findIndex((d) => d.id_programapuerperio === id);
    if (idx === -1) return of(null);
    this.data[idx] = { ...this.data[idx], ...changes };
    return of(this.data[idx]);
  }
}
