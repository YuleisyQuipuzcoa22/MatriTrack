import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { MotivoFinPuerperio } from 'src/enums/MotivoFinPuerperio';

export class FinalizarProgramaPuerperioDto {
  @IsNotEmpty({ message: 'El motivo de finalizacion es obligatorio' })
  @IsEnum(MotivoFinPuerperio, { message: 'Motivo de finalizacion invalido' })
  motivo_finalizacion: MotivoFinPuerperio;

  @ValidateIf((o) => o.motivo_finalizacion === MotivoFinPuerperio.OTROS)
  @IsNotEmpty({ message: 'Debe especificar el motivo de finalizacon' })
  @IsString()
  @Length(1, 100, {
    message: 'El motivo otros debe tener entre 1 y 100 caracteres',
  })
  motivo_otros?: string;
}