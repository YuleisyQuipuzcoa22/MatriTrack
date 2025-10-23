import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateAnalisisDto {
  @IsNotEmpty({ message: 'El nombre del análisis es obligatorio' })
  @IsString()
  @Length(2, 55, { message: 'El nombre debe tener entre 2 y 55 caracteres' })
  nombre_analisis: string;

  @IsOptional()
  @IsString()
  @MaxLength(155, {
    message: 'La descripción del análisis no debe exceder 155 caracteres',
  })
  descripcion_analisis?: string;
}
