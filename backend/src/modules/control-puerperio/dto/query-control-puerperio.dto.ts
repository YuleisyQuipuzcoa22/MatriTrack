// src/modules/control-puerperio/dto/query-control-puerperio.dto.ts
import { IsOptional, IsInt, Min, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryControlPuerperioDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10; // Límite por defecto

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC'; // Ordenar por fecha descendente por defecto
}