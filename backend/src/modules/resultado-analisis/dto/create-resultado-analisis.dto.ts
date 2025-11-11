import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateResultadoAnalisisDto {
  @IsOptional()
  @IsString()
  @Length(7, 7)
  id_control_diagnostico?: string;

  @IsOptional()
  @IsString()
  @Length(7, 7)
  id_control_puerperio?: string;

  @IsNotEmpty({ message: 'El ID del tipo de análisis es obligatorio' })
  @IsString()
  @Length(6, 6)
  id_analisis: string;

  @IsNotEmpty({ message: 'La fecha de realización es obligatoria' })
  @IsDateString()
  fecha_realizacion: string;

  @IsNotEmpty({ message: 'El nombre del laboratorio es obligatorio' })
  @IsString()
  @MaxLength(150)
  laboratorio: string;

  @IsNotEmpty({ message: 'El resultado es obligatorio' })
  @IsString()
  @MaxLength(1000)
  resultado: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacion?: string;
}