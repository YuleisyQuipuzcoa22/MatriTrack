import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Estado } from 'src/enums/Estado';

export class QueryAnalisisDto {
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
  limit?: number = 10;

  // Filtros
  @IsOptional()
  @IsString()
  nombreAnalisis?: string;

  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;

  // Ordenamiento
  @IsOptional()
  @IsString()
  sortBy?: string = 'id_analisis'; // Campo por el que ordenar

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}
