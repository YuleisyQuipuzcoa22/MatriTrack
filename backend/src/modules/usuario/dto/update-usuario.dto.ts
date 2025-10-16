// src/modules/usuario/dto/update-usuario.dto.ts
import { IsOptional, IsString, IsDateString, IsEnum, Length } from 'class-validator';
import { Estado } from '../../../enums/Estado';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  apellido?: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  telefono?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  direccion?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  numero_colegiatura?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;
}