import { 
  IsOptional, 
  IsInt, 
  IsDateString,
  IsString,
  Min,
  Max,
  Length
} from 'class-validator';

export class UpdateProgramaDiagnosticoDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  numero_gestacion?: number;

  @IsOptional()
  @IsDateString()
  fecha_probableparto?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  factor_riesgo?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  observacion?: string;
}