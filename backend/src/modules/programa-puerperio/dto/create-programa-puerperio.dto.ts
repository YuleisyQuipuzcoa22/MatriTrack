// src/modules/programa-puerperio/dto/create-programa-puerperio.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TipoParto } from '../../../enums/TipoParto';

export class CreateProgramaPuerperioDto {
  // id_historialmedico se quita, vendrá por @Param en el controlador

  @IsNotEmpty({ message: 'El tipo de parto es obligatorio' })
  @IsEnum(TipoParto)
  tipo_parto!: TipoParto;

  @IsOptional()
  @IsString()
  @MaxLength(1000, {
    message: 'La observación no puede exceder los 1000 caracteres',
  })
  observacion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'La complicación no puede exceder los 500 caracteres',
  })
  complicacion?: string;
}