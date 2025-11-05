// src/modules/control-puerperio/dto/create-control-puerperio.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  Matches,
  Length,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateControlPuerperioDto {
  // id_programapuerperio se quita, vendrá por @Param
  // usuario_id_usuario se quita, vendrá por @Req user (Token)

  // --- CAMPOS REQUERIDOS ---

  @IsNotEmpty({ message: 'El peso es obligatorio' })
  @IsNumber({}, { message: 'El peso debe ser numérico' })
  @Type(() => Number)
  @Min(30, { message: 'El peso debe ser mayor o igual a 30 kg' })
  peso: number;

  @IsNotEmpty({ message: 'La talla es obligatoria' })
  @IsNumber({}, { message: 'La talla debe ser numérica' })
  @Type(() => Number)
  @Min(1.0, { message: 'La talla mínima debe ser 1.0 m' })
  @Max(2.5, { message: 'La talla máxima debe ser 2.5 m' })
  talla: number;

  @IsNotEmpty({ message: 'La presión arterial es obligatoria' })
  @IsString({ message: 'La presión arterial debe ser un texto' })
  @Matches(/^\d{2,3}\/\d{2,3}$/, {
    message:
      'El formato de la presión arterial debe ser SÍSTOLE/DIÁSTOLE (ej. 120/80)',
  })
  presion_arterial: string;

  // --- CAMPOS OPCIONALES ---

  @IsOptional()
  @IsString()
  @Length(0, 100, {
    message: 'Involución uterina no puede exceder los 100 caracteres',
  })
  involucion_uterina?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100, {
    message: 'Cicatrización no puede exceder los 100 caracteres',
  })
  cicatrizacion?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100, {
    message: 'Estado de mamas no puede exceder los 100 caracteres',
  })
  estado_mamas_lactancia?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100, {
    message: 'Estado emocional no puede exceder los 100 caracteres',
  })
  estado_emocional?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500, {
    message: 'La observación no puede exceder los 500 caracteres',
  })
  observacion?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500, {
    message: 'La recomendación no puede exceder los 500 caracteres',
  })
  recomendacion?: string;
}