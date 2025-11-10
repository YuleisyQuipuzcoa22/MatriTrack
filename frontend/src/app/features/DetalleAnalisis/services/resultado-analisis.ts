import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

interface ApiResponse<T> {
  message: string;
  data: T;
}


export interface ResultadoAnalisisData {
  id_resultado_analisis: string;
  id_control_diagnostico?: string | null;
  id_control_puerperio?: string | null;
  id_analisis: string;
  fecha_realizacion: string; 
  fecha_registro: string;   
  laboratorio: string;
  resultado: string;
  observacion: string | null; 
  ruta_pdf: string | null; 
  
  analisis?: {
    id_analisis: string;
    nombre_analisis: string;
    descripcion_analisis: string | null;
  };

  controlMedicoDiagnostico?: {
    id_programadiagnostico: string;
  };
  controlMedicoPuerperio?: {
    id_programapuerperio: string;
  };
}

export interface CreateResultadoDto {
  id_control_diagnostico?: string;
  id_control_puerperio?: string;
  id_analisis: string;
  fecha_realizacion: string;
  laboratorio: string;
  resultado: string;
  observacion?: string; 
}

export type UpdateResultadoDto = Partial<CreateResultadoDto>;


@Injectable({
  providedIn: 'root'
})
export class ResultadoAnalisisService {
  
  private apiUrl = 'http://localhost:3000/api/resultados-analisis';

  constructor(private http: HttpClient) {}

  listarResultadosPorControl(
    idControl: string, 
    tipo: 'diagnostico' | 'puerperio'
  ): Observable<ResultadoAnalisisData[]> {
    
    const params = new HttpParams().set('tipo', tipo);
    
    return this.http.get<ApiResponse<ResultadoAnalisisData[]>>(
      `${this.apiUrl}/control/${idControl}`, 
      { params }
    ).pipe(
      map(response => response.data) 
    );
  }

  getResultadoById(id: string): Observable<ResultadoAnalisisData> {
    return this.http.get<ApiResponse<ResultadoAnalisisData>>(
      `${this.apiUrl}/${id}`
    ).pipe(
      map(response => response.data)
    );
  }

  crearResultado(dto: CreateResultadoDto): Observable<ResultadoAnalisisData> {
    return this.http.post<ApiResponse<ResultadoAnalisisData>>(
      this.apiUrl, 
      dto
    ).pipe(
      map(response => response.data)
    );
  }


   //PUT /api/resultados-analisis/:id

  actualizarResultado(id: string, dto: UpdateResultadoDto): Observable<ResultadoAnalisisData> {
    return this.http.put<ApiResponse<ResultadoAnalisisData>>(
      `${this.apiUrl}/${id}`, 
      dto
    ).pipe(
      map(response => response.data)
    );
  }

  

    //DELETE /api/resultados-analisis/:id
   
  eliminarResultado(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Sube un archivo PDF y lo asocia a un resultado existente.
   * @param id El ID del resultado (DTAXXXX)
   * @param file El archivo PDF a subir
   */
  uploadPdf(id: string, file: File): Observable<ResultadoAnalisisData> {
    const formData = new FormData();
    // 'file' debe coincidir con el nombre usado en FileInterceptor
    formData.append('file', file, file.name); 

    return this.http.post<ApiResponse<ResultadoAnalisisData>>(
      `${this.apiUrl}/${id}/upload-pdf`,
      formData
    ).pipe(
      map(res => res.data)
    );
  }

  listarResultadosPorPrograma(
    idPrograma: string, 
    tipo: 'diagnostico' | 'puerperio'
  ): Observable<ResultadoAnalisisData[]> {
    
    const params = new HttpParams().set('tipo', tipo);
    
    return this.http.get<ApiResponse<ResultadoAnalisisData[]>>(
      `${this.apiUrl}/programa/${idPrograma}`, 
      { params }
    ).pipe(
      map(response => response.data) // Extrae solo el array 'data'
    );
  }
}