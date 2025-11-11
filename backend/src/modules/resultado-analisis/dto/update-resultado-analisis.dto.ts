import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateResultadoAnalisisDto {
  @IsOptional()
  @IsDateString()
  fecha_realizacion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  laboratorio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  resultado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacion?: string;
}