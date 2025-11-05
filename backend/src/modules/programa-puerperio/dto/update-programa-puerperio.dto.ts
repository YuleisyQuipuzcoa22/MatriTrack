import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TipoParto } from '../../../enums/TipoParto';

export class UpdateProgramaPuerperioDto {
  @IsOptional()
  @IsEnum(TipoParto)
  tipo_parto?: TipoParto;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'La observación no debe exceder 1000 caracteres' })
  observacion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La complicación no debe exceder 500 caracteres' })
  complicacion?: string;
}