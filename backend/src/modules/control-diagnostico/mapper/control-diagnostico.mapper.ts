// src/modules/control-diagnostico/mapper/control-diagnostico.mapper.ts

import { ControlDiagnostico } from '../model/control_diagnostico.entity';
import { CreateControlDiagnosticoDto } from '../Dto/create-control-diagnostico.dto';
import { UpdateControlDiagnosticoDto } from '../Dto/update-control-diagnostico.dt';
export class ControlDiagnosticoMapper {
  
  /**
   * Convierte un DTO de creación a una Entidad ControlDiagnostico, 
   * asignando los IDs y estableciendo valores por defecto (si aplica).
   */
  static toEntity(
    dto: CreateControlDiagnosticoDto,
    id_control_diagnostico: string,
    id_programadiagnostico: string,
    id_usuario: string,
  ): ControlDiagnostico {
    const control = new ControlDiagnostico();
    
    // Asignación de IDs
    control.id_control_diagnostico = id_control_diagnostico;
    control.id_programadiagnostico = id_programadiagnostico;
    control.id_usuario = id_usuario;

    // Campos obligatorios del DTO
    control.semana_gestacion = dto.semana_gestacion;
    control.peso = dto.peso;
    control.talla = dto.talla;
    control.presion_arterial = dto.presion_arterial;
    control.altura_uterina = dto.altura_uterina;
    control.fcf = dto.fcf;

    // Campos opcionales del DTO
    // Usamos el operador nullish coalescing (??) para asegurar que si es undefined, 
    // se guarde null, coincidiendo con la columna nullable en la BD.
    control.observacion = dto.observacion ?? null;
    control.recomendacion = dto.recomendacion ?? null;

    return control;
  }

  // ----------------------------------------------------------------------

  /**
   * Actualiza una entidad ControlDiagnostico existente con los datos del DTO de actualización.
   */
  static updateEntity(
    control: ControlDiagnostico,
    dto: UpdateControlDiagnosticoDto,
  ): ControlDiagnostico {
    
    // Se actualizan solo los campos que vienen definidos (no undefined) en el DTO

    if (dto.semana_gestacion !== undefined) {
      control.semana_gestacion = dto.semana_gestacion;
    }

    if (dto.peso !== undefined) {
      control.peso = dto.peso;
    }

    if (dto.talla !== undefined) {
      control.talla = dto.talla;
    }

    if (dto.presion_arterial !== undefined) {
      control.presion_arterial = dto.presion_arterial;
    }

    if (dto.altura_uterina !== undefined) {
      control.altura_uterina = dto.altura_uterina;
    }

    if (dto.fcf !== undefined) {
      control.fcf = dto.fcf;
    }

    // Campos opcionales: permite pasar un string vacío ('') para limpiar el campo
    if (dto.observacion !== undefined) {
      control.observacion = dto.observacion || null;
    }

    if (dto.recomendacion !== undefined) {
      control.recomendacion = dto.recomendacion || null;
    }

    return control;
  }
}