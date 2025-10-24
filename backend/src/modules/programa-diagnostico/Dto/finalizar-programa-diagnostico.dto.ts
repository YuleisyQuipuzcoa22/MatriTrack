import { IsNotEmpty, IsEnum, IsOptional, IsString, Length, ValidateIf } from 'class-validator';
import { MotivoFin } from 'src/enums/MotivoFin';

export class FinalizarProgramaDiagnosticoDto{
    @IsNotEmpty({message: 'El motivo de finalizacion es obligatorio'})
    @IsEnum(MotivoFin,{message: 'Motivo de finalizacion invalido'})
    motivo_finalizacion: MotivoFin;

    @ValidateIf((o)=>o.motivo_finalizacion === MotivoFin.OTROS)
    @IsNotEmpty({message: 'Debe especificar el motivo de finalziacion'})
    @IsString()
    @Length(1, 100, {message: 'El motivo otros debe tener entre 1 y 100 caracteres'})
    motivo_otros?: string;

    

}