import { CreateProgramaPuerperioDto } from '../dto/create-programa-puerperio.dto';
import { ProgramaPuerperio } from '../model/programa_puerperio.entity';

export class ProgramaPuerperioMapper {
  static toEntity(dto: CreateProgramaPuerperioDto, id: string): ProgramaPuerperio {
    const p = new ProgramaPuerperio();
    p.id_programapuerperio = id;
    p.id_historialmedico = dto.id_historialmedico;
    p.tipo_parto = dto.tipo_parto;
    p.observacion = dto.observacion ?? null;
    p.complicacion = dto.complicacion ?? null;
    return p;
  }
}
