import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { TipoSangre } from "src/enums/TipoSangre";

export class UpdateHistorialMedicoDto {
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Los antecedentes médicos no deben exceder 500 caracteres' })
  antecedente_medico?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Las alergias no deben exceder 500 caracteres' })
  alergia?: string;

  @IsOptional()
  @IsEnum(TipoSangre, { message: 'Tipo de sangre inválido' })
  tipo_sangre?: TipoSangre;
}