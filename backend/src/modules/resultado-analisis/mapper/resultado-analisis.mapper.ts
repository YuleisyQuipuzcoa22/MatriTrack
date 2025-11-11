import { CreateResultadoAnalisisDto } from '../dto/create-resultado-analisis.dto';
import { ResultadoAnalisis } from '../model/resultado-analisis.entity';


export class ResultadoAnalisisMapper {
  static toEntity(
    dto: CreateResultadoAnalisisDto,
    id: string,
  ): ResultadoAnalisis {
    const r = new ResultadoAnalisis();
    r.id_resultado_analisis = id;

    r.id_control_diagnostico = dto.id_control_diagnostico ?? null;
    r.id_control_puerperio = dto.id_control_puerperio ?? null;

    r.id_analisis = dto.id_analisis;
    r.fecha_realizacion = new Date(dto.fecha_realizacion);
    r.laboratorio = dto.laboratorio;
    r.resultado = dto.resultado;
    r.observacion = dto.observacion ?? null;
    
    return r;
  }
}