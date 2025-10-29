import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
 //models
export interface DetalleAnalisisData {
  id: string;
  id_control: string;
  id_analisis: string;
  tipoAnalisis: string; // nombre del análisis (por interfaz)
  fechaRealizacion: string; // ISO date
  fechaRegistro: string;    // ISO date (registro en el sistema)
  laboratorio: string;
  resultado: string;
  observaciones: string;
  pdfResultado: string; // ruta del PDF
  expirado?: boolean;   // true si ya pasaron 48h desde registro
}

@Injectable({
  providedIn: 'root'
})
export class DetalleAnalisisService {

  constructor() {}

  listarDetalles(): Observable<DetalleAnalisisData[]> {
    //  formato YYYY-MM-DD para los mocks
    const mock: DetalleAnalisisData[] = [
      {
        id: 'AN0001',
        id_control: 'CTD0001',
        id_analisis: 'A001',
        tipoAnalisis: 'Hemograma Completo',
        fechaRealizacion: '2025-10-10',
        fechaRegistro: '2025-10-11',
        laboratorio: 'Laboratorios Santa María',
        resultado: 'Hemoglobina 13.5 g/dL, Leucocitos 7,000/mm³ X',
        observaciones: 'Resultado dentro de parámetros normales.',
        pdfResultado: '/assets/pdf/hemograma.pdf',
        expirado: false
      },
      {
        id: 'AN0002',
        id_control: 'CTD0001',
        id_analisis: 'A002',
        tipoAnalisis: 'Examen de Orina',
        fechaRealizacion: '2025-10-08',
        fechaRegistro: '2025-10-09',
        laboratorio: 'Clínica Vida Nueva',
        resultado: 'Presencia leve de proteínas, sin bacterias.',
        observaciones: 'Requiere control adicional.',
        pdfResultado: '/assets/pdf/orina.pdf',
        expirado: false
      },
      {
        id: 'AN0003',
        id_control: 'CTD0001',
        id_analisis: 'A003',
        tipoAnalisis: 'Glucosa en sangre',
        fechaRealizacion: '2025-10-13',
        fechaRegistro: '2025-10-13',
        laboratorio: 'Lab. Central de Diagnóstico',
        resultado: 'Glucosa 92 mg/dL',
        observaciones: 'Normal, continuar controles.',
        pdfResultado: '/assets/pdf/glucosa.pdf',
        expirado: false
      }
    ];

    return of(mock);
  }

  verificarLimite48Horas(fechaRegistro: string): boolean {
    const fecha = new Date(fechaRegistro);
    const ahora = new Date();
    const diferenciaHoras = (ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60);
    return diferenciaHoras <= 48;
  }

  // Método mock para crear/guardar un detalle de análisis
  crearDetalle(detalle: DetalleAnalisisData): Observable<DetalleAnalisisData> {
    // generar un id simple mock
    const nuevo: DetalleAnalisisData = {
      ...detalle,
      id: 'AN' + Math.floor(Math.random() * 9000 + 1000).toString(),
      // normalizar fechaRegistro a YYYY-MM-DD
      fechaRegistro: detalle.fechaRegistro ? this._toDateOnly(detalle.fechaRegistro) : new Date().toISOString().slice(0,10),
      fechaRealizacion: detalle.fechaRealizacion ? this._toDateOnly(detalle.fechaRealizacion) : new Date().toISOString().slice(0,10)
    } as DetalleAnalisisData;
    // aqui se hace el POST al backend
    return of(nuevo);
  }

  // Obtener un detalle por id (mock)
  getDetalleById(id: string): Observable<DetalleAnalisisData | null> {
    let encontrado: DetalleAnalisisData | null = null;
    this.listarDetalles().subscribe(list => {
      const f = list.find(x => x.id === id);
      if (f) { encontrado = f; }
    });
    return of(encontrado);
  }

  // Actualizar detalle (mock)
  actualizarDetalle(id: string, cambios: Partial<DetalleAnalisisData>): Observable<DetalleAnalisisData | null> {
    // En mock simplemente devolvemos el objeto con id y cambios aplicados
    const actualizado: DetalleAnalisisData = {
      id,
      id_control: cambios.id_control ?? 'CTD0001',
      id_analisis: cambios.id_analisis ?? 'A000',
  tipoAnalisis: (cambios.tipoAnalisis && typeof cambios.tipoAnalisis === 'string') ? cambios.tipoAnalisis : '',
  fechaRealizacion: cambios.fechaRealizacion ? this._toDateOnly(cambios.fechaRealizacion) : new Date().toISOString().slice(0,10),
  fechaRegistro: cambios.fechaRegistro ? this._toDateOnly(cambios.fechaRegistro) : new Date().toISOString().slice(0,10),
      laboratorio: cambios.laboratorio ?? '',
      resultado: cambios.resultado ?? '',
      observaciones: cambios.observaciones ?? '',
      pdfResultado: cambios.pdfResultado ?? ''
    } as DetalleAnalisisData;
    return of(actualizado);
  }

  // Helper: normaliza cualquier string de fecha (ISO o datetime-local) a 'YYYY-MM-DD'
  private _toDateOnly(dateStr: string): string {
    try {
      // si viene en formato 'yyyy-mm-dd' ya
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) { return dateStr; }
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) { return new Date().toISOString().slice(0,10); }
      return d.toISOString().slice(0,10);
    } catch {
      return new Date().toISOString().slice(0,10);
    }
  }
}
