import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Estado } from 'src/enums/Estado';

export class UpdateAnalisisDto {
  @IsOptional()
  @IsString()
  @Length(2, 55)
  nombre_analisis: string;

  @IsOptional()
  @IsString()
  @MaxLength(155)
  descripcion_analisis?: string;

  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;
}
