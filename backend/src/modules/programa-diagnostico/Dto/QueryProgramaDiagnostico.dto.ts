import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Estado } from 'src/enums/Estado';

export class QueryProgramaDiagnosticoDto {
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
  nombreApellido?: string; // Busca en nombre Y apellido del paciente

  @IsOptional()
  @IsString()
  dni?: string; // DNI del paciente

  @IsOptional()
  
  @Transform(({ value }) => {
    // Normalizar: acepta 'A', 'ACTIVO', etc.
    if (value === 'A' || value === 'ACTIVO') return Estado.ACTIVO;
    if (value === 'I' || value === 'INACTIVO') return Estado.INACTIVO;
    if (value === 'F' || value === 'FINALIZADO') return Estado.FINALIZADO;
    return value;
  })
  @IsEnum(Estado)
  estadoPaciente?: Estado; // Estado del paciente (A/I)

  @IsOptional()
  
  @Transform(({ value }) => {
    if (value === 'A' || value === 'ACTIVO') return Estado.ACTIVO;
    if (value === 'F' || value === 'FINALIZADO') return Estado.FINALIZADO;
    return value;
  })
  @IsEnum(Estado, { message: 'Estado de programa inválido (solo ACTIVO o FINALIZADO)' })
  estadoPrograma?: Estado; // Estado del programa (A/F)

  // Ordenamiento
  @IsOptional()
  @IsString()
  sortBy?: string = 'fecha_inicio'; // Por defecto ordena por fecha de inicio

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}