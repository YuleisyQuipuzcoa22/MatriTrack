import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Estado } from 'src/enums/Estado';
import { Sexo } from 'src/enums/Sexo';

export class UpdatePacienteDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  apellido?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  direccion?: string;

  @IsOptional()
  @IsEnum(Sexo)
  sexo?: Sexo;

  @IsOptional()
  @IsString()
  @Length(9, 15)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  correo_electronico?: string;

  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;

  @IsOptional()
  @IsDateString()
  fecha_inhabilitacion?: string | null;
}