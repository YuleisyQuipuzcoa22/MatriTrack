// src/modules/usuario/dto/update-usuario.dto.ts
import { IsOptional, IsString, IsDateString, IsEnum, Length } from 'class-validator';
import { Estado } from '../../../enums/Estado';
import { RolUsuario } from 'src/enums/RolUsuario';
import { Exclude } from 'class-transformer';

export class UpdateUsuarioDto {

  

  @IsOptional()
  @IsString()
  @Length(2, 50)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  apellido?: string;

  @IsOptional()
  @IsString()
  @Length(1, 254)
  correo_electronico?: string;

  @IsOptional()
  @IsString()
  @Length(9, 15)
  telefono?: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  direccion?: string;

  @IsOptional()
  @IsString()
  @Length(6, 10)
  numero_colegiatura?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;

  @IsOptional()
  @IsEnum(RolUsuario)
  rol?: RolUsuario;
}