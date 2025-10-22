import { IsOptional, IsString, IsEnum, Length, IsNotEmpty, MaxLength } from 'class-validator';
import { TipoSangre } from 'src/enums/TipoSangre';

export class CreateHistorialMedicoDto {
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Los antecedentes médicos no deben exceder 500 caracteres' })
  antecedente_medico?: string;

  @IsOptional()
  @IsString()
   @MaxLength(500, { message: 'Las alergias no deben exceder 500 caracteres' })
  alergia?: string;

  @IsNotEmpty({message: 'El tipo de sangre es obligatorio'})
  @IsEnum(TipoSangre, { message: 'Tipo de sangre inválido' })
  tipo_sangre?: TipoSangre;
}
