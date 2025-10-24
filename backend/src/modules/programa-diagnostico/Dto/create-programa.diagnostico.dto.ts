import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsDateString,
  IsOptional,
  Min,
  Max,
  Length,
  isNotEmpty,
} from 'class-validator';


export class CreateProgramaDiagnosticoDto{
    @IsNotEmpty({ message: 'El número de gestación es obligatorio' })
    @IsInt({message: 'El numero de gestación debe ser un numero entero'})
    @Min(1,{message: 'El numero de gestacion debe ser al menos 1'})
    @Max(20,{message: 'El numero de gestacion no puede ser mayor a 20'})
    numero_gestacion: number;

    @IsOptional()
    @IsDateString({}, { message: 'Formato de fecha probable de parto inválido' })
    fecha_probableparto?: string;

    @IsOptional()
    @IsString()
    @Length(0, 500, { message: 'El factor de riesgo debe tener máximo 500 caracteres' })
    factor_riesgo?: string;

    @IsOptional()
    @IsString()
    @Length(0, 1000, { message: 'La observación debe tener máximo 1000 caracteres' })
    observacion?: string;



}