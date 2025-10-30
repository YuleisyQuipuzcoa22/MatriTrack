import { Estado } from "src/enums/Estado";
import { MotivoFin } from "src/enums/MotivoFin";

export class ProgramaDiagnosticoResponseDto {
  id_programadiagnostico: string;
  id_historialmedico: string;
  numero_gestacion: number;
  fecha_inicio: Date;
  fecha_probableparto: Date | null;
  factor_riesgo: string | null;
  observacion: string | null;
  estado: Estado; // 'A', 'F'
  fecha_finalizacion: Date | null;
  motivo_finalizacion: MotivoFin | null;
  motivo_otros: string | null;
  
  //Datos anidados del paciente (para listados)
  paciente?: {
    id_paciente: string;
    nombre: string;
    apellido: string;
    dni: string;
    edad: number;
  };
}