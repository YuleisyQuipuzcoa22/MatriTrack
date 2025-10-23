import { CreateAnalisisDto } from '../dto/create_analisis.dto';
import { ResponseAnalisisDto } from '../dto/response_analisis.dto';
import { Analisis } from '../model/analisis.entity';

export class AnalisisMapper {
  static toResponseDto(analisis: Analisis): ResponseAnalisisDto {
    return {
      id_analisis: analisis.id_analisis,
      nombre_analisis: analisis.nombre_analisis,
      descripcion_analisis: analisis.descripcion_analisis,
    };
  }
  static toResponseDtoList(analisis: Analisis[]): ResponseAnalisisDto[] {
    return analisis.map((analisis) => this.toResponseDto(analisis));
  }
  static toEntity(createDto: CreateAnalisisDto, id: string): Analisis {
    const analisis = new Analisis();
    analisis.id_analisis = id;
    analisis.nombre_analisis = createDto.nombre_analisis;
    analisis.descripcion_analisis = createDto.descripcion_analisis || null;
    return analisis;
  }
  static updateEntity(analisis: Analisis, updateDto: any): Analisis {
    if (updateDto.nombre_analisis)
      analisis.nombre_analisis = updateDto.nombre_analisis;
    if (updateDto.descripcion_analisis)
      analisis.descripcion_analisis = updateDto.descripcion_analisis;
    return analisis;
  }
}
