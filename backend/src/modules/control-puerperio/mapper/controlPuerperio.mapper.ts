// src/modules/control-puerperio/mapper/controlPuerperio.mapper.ts
import { CreateControlPuerperioDto } from '../dto/create-control-puerperio.dto';
import { UpdateControlPuerperioDto } from '../dto/update-control-puerperio.dto';
import { ControlPuerperio } from '../model/control_puerperio.entity';

export class ControlPuerperioMapper {
  static toEntity(
    dto: CreateControlPuerperioDto,
    id_control: string,
    id_programa: string,
    id_usuario: string,
  ): ControlPuerperio {
    const c = new ControlPuerperio();
    c.id_control_puerperio = id_control;
    c.id_programapuerperio = id_programa;
    c.usuario_id_usuario = id_usuario;
    c.peso = dto.peso;
    c.talla = dto.talla;
    c.presion_arterial = dto.presion_arterial;
    c.involucion_uterina = dto.involucion_uterina ?? null;
    c.cicatrizacion = dto.cicatrizacion ?? null;
    c.estado_mamas_lactancia = dto.estado_mamas_lactancia ?? null;
    c.estado_emocional = dto.estado_emocional ?? null;
    c.observacion = dto.observacion ?? null;
    c.recomendacion = dto.recomendacion ?? null;
    return c;
  }

  static updateEntity(
    control: ControlPuerperio,
    dto: UpdateControlPuerperioDto,
  ): ControlPuerperio {
    if (dto.peso !== undefined) control.peso = dto.peso;
    if (dto.talla !== undefined) control.talla = dto.talla;
    if (dto.presion_arterial !== undefined)
      control.presion_arterial = dto.presion_arterial;
    if (dto.involucion_uterina !== undefined)
      control.involucion_uterina = dto.involucion_uterina || null;
    if (dto.cicatrizacion !== undefined)
      control.cicatrizacion = dto.cicatrizacion || null;
    if (dto.estado_mamas_lactancia !== undefined)
      control.estado_mamas_lactancia = dto.estado_mamas_lactancia || null;
    if (dto.estado_emocional !== undefined)
      control.estado_emocional = dto.estado_emocional || null;
    if (dto.observacion !== undefined)
      control.observacion = dto.observacion || null;
    if (dto.recomendacion !== undefined)
      control.recomendacion = dto.recomendacion || null;

    return control;
  }
}