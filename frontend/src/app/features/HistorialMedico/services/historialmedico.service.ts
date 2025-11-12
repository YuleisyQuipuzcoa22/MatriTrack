import { Injectable } from '@angular/core';
import { ProgramaDiagnosticoService } from '../../ProgramaDiagnostico/services/programadiagnostico.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/API_Response-interfaces/api-response.model';
import { HistorialMedico, HistorialMedicoCompleto } from '../model/historial-medico';

@Injectable({
  providedIn: 'root',
})
export class HistorialmedicoService {
  private apiUrl = 'http://localhost:3000/api/historial-medico';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el Historial Médico completo de un paciente usando su ID.
   * Endpoint usado: GET historial-medico/paciente/:id_paciente
   * * @param idPaciente El ID del paciente (id_paciente).
   * @returns Un Observable con el HistorialMedicoCompleto (incluye programas).
   */
  findByPacienteId(idPaciente: string): Observable<HistorialMedicoCompleto> {
    const url = `${this.apiUrl}/paciente/${idPaciente}`;

    return this.http
      .get<ApiResponse<HistorialMedicoCompleto>>(url)
      .pipe(map((response) => response.data));
  }

  updateHistorialMedico(
    idHistorial: string,
    data: {
      antecedente_medico?: string;
      alergia?: string;
      tipo_sangre?: string;
    }
  ): Observable<HistorialMedico> {
    const url = `${this.apiUrl}/${idHistorial}`;
    return this.http
      .put<ApiResponse<HistorialMedico>>(url, data)
      .pipe(map((response) => response.data));
  }
}
