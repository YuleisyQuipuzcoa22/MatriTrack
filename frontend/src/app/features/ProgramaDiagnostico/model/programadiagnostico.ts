// src/types/programaDiagnostico.types.ts
export enum Estado {
  ACTIVO = 'A',
  INACTIVO = 'I',
  FINALIZADO = 'F',
}

export enum MotivoFin {
  PARTO = 'PARTO',
  VOLUNTAD_PACIENTE = 'VOLUNTAD_PACIENTE',
  OTROS = 'OTROS',
}

export interface Paciente {
  id_paciente: string;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nacimiento: string;
  direccion: string;
  sexo: string;
  telefono: string;
  correo_electronico: string;
}

export interface HistorialMedico {
  id_historialmedico: string;
  fecha_iniciohistorial: string;
  antecedente_medico: string | null;
  alergia: string | null;
  tipo_sangre: string | null;
  paciente: Paciente;
}

export interface ProgramaDiagnostico {
  id_programadiagnostico: string;
  id_historialmedico: string;
  fecha_inicio: string;
  numero_gestacion: number;
  fecha_probableparto: string | null;
  factor_riesgo: string | null;
  observacion: string | null;
  estado: "ACTIVO"| "FINALIZADO";
  fecha_finalizacion: string | null;
  motivo_finalizacion: MotivoFin | null;
  motivo_otros: string | null;
  //historialMedico: HistorialMedico;

  paciente?: {
    id_paciente: string;
    nombre: string;
    apellido: string;
    dni: string;
    edad: number;
  };
}

export interface CreateProgramaDiagnosticoDto {
  numero_gestacion: number;
  fecha_probableparto?: string;
  factor_riesgo?: string;
  observacion?: string;
}

export interface FinalizarProgramaDiagnosticoDto {
  motivo_finalizacion: MotivoFin;
  motivo_otros?: string;
}


