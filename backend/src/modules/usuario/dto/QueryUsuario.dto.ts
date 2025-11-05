import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Estado } from 'src/enums/Estado';

export class QueryUsuarioDto {
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
  @Matches(/^[0-9]*$/, { message: 'El DNI debe contener solo números' }) //Validar solo números
  dni?: string;

   @IsOptional()
  @Transform(({ value }) => {
   
    if (value === 'A') return Estado.ACTIVO;
    if (value === 'I') return Estado.INACTIVO;
    return value;
  })
  @IsEnum(Estado)
  estado?: Estado;


  // Ordenamiento
  @IsOptional()
  @IsString()
  sortBy?: string = 'id_usuario'; // Campo por el que ordenar

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}
