import {
  IsNumber,
  IsString,
  Min,
  Max,
  Matches,
  Length,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateControlPuerperioDto {
  @IsOptional()
  @IsNumber({}, { message: 'El peso debe ser numérico' })
  @Type(() => Number)
  @Min(30, { message: 'El peso debe ser mayor o igual a 30 kg' })
  peso?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La talla debe ser numérica' })
  @Type(() => Number)
  @Min(1.0, { message: 'La talla mínima debe ser 1.0 m' })
  @Max(2.5, { message: 'La talla máxima debe ser 2.5 m' })
  talla?: number;

  @IsOptional()
  @IsString({ message: 'La presión arterial debe ser un texto' })
  @Matches(/^\d{2,3}\/\d{2,3}$/, {
    message:
      'El formato de la presión arterial debe ser SÍSTOLE/DIÁSTOLE (ej. 120/80)',
  })
  presion_arterial?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  involucion_uterina?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  cicatrizacion?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  estado_mamas_lactancia?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  estado_emocional?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  observacion?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  recomendacion?: string;

  
}