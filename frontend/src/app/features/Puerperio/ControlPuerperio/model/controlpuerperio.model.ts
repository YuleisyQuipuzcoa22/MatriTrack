// src/app/features/Puerperio/ControlPuerperio/model/controlpuerperio.model.ts

// Interfaz para el objeto ControlPuerperio (respuesta de la API)
export interface ControlPuerperio {
  id_control_puerperio: string;
  id_programapuerperio: string;
  usuario_id_usuario: string;
  fecha_controlpuerperio: string; // ISO Date
  fecha_modificacion: string | null; // ISO Date
  peso: number;
  talla: number;
  presion_arterial: string;
  involucion_uterina: string | null;
  cicatrizacion: string | null;
  estado_mamas_lactancia: string | null;
  estado_emocional: string | null;
  observacion: string | null;
  recomendacion: string | null;

  // Datos del usuario (opcional, si se incluye en la relación)
  usuario?: {
    nombre: string;
    apellido: string;
  };
}

// DTO para crear un control
export interface CreateControlPuerperioDto {
  peso: number;
  talla: number;
  presion_arterial: string;
  involucion_uterina?: string;
  cicatrizacion?: string;
  estado_mamas_lactancia?: string;
  estado_emocional?: string;
  observacion?: string;
  recomendacion?: string;
}

// DTO para actualizar un control (parcial)
export type UpdateControlPuerperioDto = Partial<CreateControlPuerperioDto>;