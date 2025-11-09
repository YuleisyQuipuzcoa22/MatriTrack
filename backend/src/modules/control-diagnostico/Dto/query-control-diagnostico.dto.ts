import { IsOptional, IsInt, Min, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
export class QueryControlDiagnosticoDto {
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
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'] as const)
  order?: 'ASC' | 'DESC' = 'DESC';
}
