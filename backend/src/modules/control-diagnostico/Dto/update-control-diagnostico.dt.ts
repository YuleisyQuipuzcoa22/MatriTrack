// src/modules/control-diagnostico/dto/update-control-diagnostico.dto.ts

import { IsOptional, IsInt, IsNumber, IsString, Min, Max, Matches, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateControlDiagnosticoDto {
  
  @IsOptional()
  @IsInt({ message: 'La semana de gestación debe ser un número entero' })
  @Min(1, { message: 'Mínimo 1 semana de gestación' })
  @Max(42, { message: 'Máximo 42 semanas de gestación' })
  semana_gestacion?: number;

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
    message: 'El formato debe ser SÍSTOLE/DIÁSTOLE (ej. 120/80)',
  })
  presion_arterial?: string;

  @IsOptional()
  @IsNumber({}, { message: 'La altura uterina debe ser numérica' })
  @Type(() => Number)
  @Min(5, { message: 'La altura uterina debe ser al menos 5 cm' })
  @Max(45, { message: 'La altura uterina no debe exceder 45 cm' })
  altura_uterina?: number;

  @IsOptional()
  @IsInt({ message: 'La FCF debe ser un número entero' })
  @Min(100, { message: 'La FCF mínima debe ser 100 lpm' })
  @Max(180, { message: 'La FCF máxima debe ser 180 lpm' })
  fcf?: number;

  @IsOptional()
  @IsString()
  @Length(0, 255, { message: 'La observación no puede exceder los 255 caracteres' })
  observacion?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255, { message: 'La recomendación no puede exceder los 255 caracteres' })
  recomendacion?: string;
}