// src/app/features/Puerperio/ControlPuerperio/model/controlpuerperio.model.ts
/*asi esta que trae los datos el backend*/

/* {
      "involucion_uterina": null,
      "cicatrizacion": null,
      "estado_mamas_lactancia": null,
      "estado_emocional": null,
      "observacion": null,
      "recomendacion": null,
      "id_control_puerperio": "CP00033",
      "id_programapuerperio": "PP00001",
      "usuario_id_usuario": "OB0003",
      "fecha_controlpuerperio": "2025-11-06T17:00:13.210Z",
      "fecha_modificacion": "2025-11-06T17:00:13.210Z",
      "peso": "66.00",
      "talla": "1.62",
      "presion_arterial": "120/80",
      "usuario": {
        "numero_colegiatura": "741852",
        "id_usuario": "OB0003",
        "dni": "74654129",
        "nombre": "Sofía",
        "apellido": "Vergara",
        "rol": "Administrador",
        "estado": "A",
        "fecha_nacimiento": "2004-11-20",
        "correo_electronico": "sofvergara@gmail.com",
        "telefono": "904631017",
        "direccion": "Av España 123"
      }
    },*/
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