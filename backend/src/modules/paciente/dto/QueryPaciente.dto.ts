import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Estado } from 'src/enums/Estado';

export class QueryPacienteDto {
  // Paginación
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 9;

  // Filtros
  @IsOptional()
  @IsString()
  nombreApellido?: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;

  // Ordenamiento
  @IsOptional()
  @IsString()
  sortBy?: string = 'id_paciente'; // Campo por el que ordenar

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}