import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgramaDiagnostico, 
  FiltrosPrograma, 
  CreateProgramaDiagnosticoDto, 
  FinalizarProgramaDiagnosticoDto,
  Estado } from '../model/programadiagnostico';

// URL base de tu API (Ajusta si es diferente)
const API_URL = 'http://localhost:3000/api/programas-diagnostico';

@Injectable({
  providedIn: 'root'
})
export class ProgramaDiagnosticoService {

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de programas de diagnóstico aplicando filtros.
   * @param filtros Objeto con dni, nombre o estado para filtrar.
   */
  getProgramas(filtros: FiltrosPrograma = {}): Observable<ProgramaDiagnostico[]> {
    let params = new HttpParams();

    // Construye los parámetros de la consulta (query parameters)
    if (filtros.dni) {
      params = params.set('dni', filtros.dni);
    }
    if (filtros.nombre) {
      params = params.set('nombre', filtros.nombre);
    }
    // Si el estado es 'TODOS', no se añade el parámetro para traer todos.
    if (filtros.estado && filtros.estado !== 'TODOS') {
      params = params.set('estado', filtros.estado);
    }

    // El endpoint de listado espera los parámetros en la query
    return this.http.get<ProgramaDiagnostico[]>(API_URL, { params });
  }

  /**
   * Obtiene un programa de diagnóstico por su ID.
   * @param id_programa El ID del programa.
   */
  getProgramaById(id_programa: string): Observable<ProgramaDiagnostico> {
    return this.http.get<ProgramaDiagnostico>(`${API_URL}/${id_programa}`);
  }

  /**
   * Crea un nuevo programa de diagnóstico asociado a un Historial Médico.
   * @param id_historial El ID del historial médico del paciente.
   * @param dto Los datos de creación del programa.
   */
  createPrograma(id_historial: string, dto: CreateProgramaDiagnosticoDto): Observable<ProgramaDiagnostico> {
    // Asume que el backend tiene un endpoint de registro que usa el ID del historial
    // Ejemplo: POST /api/programas-diagnostico/historial/{id_historial}
    return this.http.post<ProgramaDiagnostico>(`${API_URL}/historial/${id_historial}`, dto);
  }
  
  /**
   * Edita la información de un programa existente.
   * @param id_programa El ID del programa a editar.
   * @param dto Los datos a actualizar (se puede reutilizar CreateProgramaDiagnosticoDto si es similar).
   */
  updatePrograma(id_programa: string, dto: CreateProgramaDiagnosticoDto): Observable<ProgramaDiagnostico> {
    // Utiliza el método PUT o PATCH
    return this.http.patch<ProgramaDiagnostico>(`${API_URL}/${id_programa}`, dto);
  }

  /**
   * Finaliza un programa de diagnóstico.
   * @param id_programa El ID del programa a finalizar.
   * @param dto Los datos de finalización (motivo).
   */
  finalizar(id_programa: string, dto: FinalizarProgramaDiagnosticoDto): Observable<ProgramaDiagnostico> {
    // Asume un endpoint específico para la acción de finalizar
    return this.http.post<ProgramaDiagnostico>(`${API_URL}/${id_programa}/finalizar`, dto);
  }

  /**
   * Activa/Habilita un programa que estaba inactivo o finalizado.
   * @param id_programa El ID del programa a activar.
   */
  activar(id_programa: string): Observable<ProgramaDiagnostico> {
    // Asume un endpoint específico para la acción de activar/habilitar
    return this.http.post<ProgramaDiagnostico>(`${API_URL}/${id_programa}/activar`, {});
  }
}