import { ProgramaDiagnostico } from '../../ProgramaDiagnostico/model/programadiagnostico';
import { ProgramaPuerperio } from '../../Puerperio/ProgramaPuerperio/model/programapuerperio.model';

export interface HistorialMedico {
  id_historialmedico: string;
  antecedente_medico: string | null;
  alergia: string | null;
  tipo_sangre: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  fecha_iniciohistorial: string;
}

export interface HistorialMedicoCompleto extends HistorialMedico {
  programasDiagnostico?: ProgramaDiagnostico[];
  programasPuerperio?: ProgramaPuerperio[];
}
