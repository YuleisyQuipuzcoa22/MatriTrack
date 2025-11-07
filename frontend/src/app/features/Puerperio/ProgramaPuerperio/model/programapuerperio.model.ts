// src/app/features/Puerperio/ProgramaPuerperio/model/programapuerperio.model.ts
import { PacienteData } from '../../../Paciente/model/paciente-historial';

// Enum para el estado (debe coincidir con el backend)
export enum Estado {
  ACTIVO = 'A',
  INACTIVO = 'I',
  FINALIZADO = 'F',
}

// Enum para el tipo de parto (debe coincidir con el backend)
export enum TipoParto {
  NATURAL = 'NATURAL',
  CESAREA = 'CESAREA',
}

// Enum para el motivo de finalización (debe coincidir con el backend)
export enum MotivoFinPuerperio {
  ALTA_MEDICA = 'ALTA_MEDICA',
  VOLUNTAD_PACIENTE = 'VOLUNTAD_PACIENTE',
  OTROS = 'OTROS',
}

// Interfaz para el objeto ProgramaPuerperio (respuesta de la API)
export interface ProgramaPuerperio {
  id_programapuerperio: string;
  id_historialmedico: string;
  fecha_inicio: string; // ISO Date
  tipo_parto: TipoParto;
  observacion: string | null;
  complicacion: string | null;
  estado: "A"| "F";
  fecha_finalizacion: string | null; // ISO Date
  motivo_finalizacion: MotivoFinPuerperio | null;
  motivo_otros: string | null;

  // Datos del paciente (para listados)
  paciente?: {
    id_paciente: string;
    nombre: string;
    apellido: string;
    dni: string;
    edad: number;
  };
}

// DTO para crear un programa
export interface CreateProgramaPuerperioDto {
  tipo_parto: TipoParto;
  observacion?: string;
  complicacion?: string;
}

// DTO para actualizar un programa
export interface UpdateProgramaPuerperioDto {
  tipo_parto?: TipoParto;
  observacion?: string;
  complicacion?: string;
}

// DTO para finalizar un programa
export interface FinalizarProgramaPuerperioDto {
  motivo_finalizacion: MotivoFinPuerperio;
  motivo_otros?: string;
}

// Interfaz para el paciente disponible (respuesta de /disponibles/pacientes)
export interface PacienteParaPuerperio {
  id_historialmedico: string;
  id_paciente: string;
  nombre_completo: string;
  dni: string;
  edad: number;
  fecha_parto: string; // Fecha en que finalizó el programa de diagnóstico
}