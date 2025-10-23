import { CreateControlPuerperioDto } from '../dto/create-control-puerperio.dto';
import { ControlPuerperio } from '../model/control_puerperio.entity';

export class ControlPuerperioMapper {
  static toEntity(dto: CreateControlPuerperioDto, id: string): ControlPuerperio {
    const c = new ControlPuerperio();
    c.id_control_puerperio = id;
    c.id_programapuerperio = dto.id_programapuerperio;
    c.usuario_id_usuario = dto.usuario_id_usuario;
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
}
