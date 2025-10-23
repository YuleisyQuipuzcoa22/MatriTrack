import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

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

  // Ordenamiento
  @IsOptional()
  @IsString()
  sortBy?: string = 'id_analisis'; // Campo por el que ordenar

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}
