import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sexo } from 'src/enums/Sexo';
import { CreateHistorialMedicoDto } from 'src/modules/historial-medico/Dto/create-historialMedico.dto';

export class CreatePacienteDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  @Length(2, 50, { message: 'El apellido debe tener entre 2 y 50 caracteres' })
  apellido: string;

  @IsNotEmpty({ message: 'El DNI es obligatorio' })
  @IsString()
  @Length(8, 8, { message: 'El DNI debe tener exactamente 8 caracteres' })
  dni: string;

  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  @IsDateString({}, { message: 'Formato de fecha inválido' })
  fecha_nacimiento: string;

  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @IsString()
  @Length(6, 100, {
    message: 'La dirección debe tener entre 6 y 100 caracteres',
  })
  direccion: string;

  @IsNotEmpty({ message: 'El sexo es obligatorio' })
  @IsEnum(Sexo, { message: 'Sexo inválido' })
  sexo: Sexo;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString()
  @Length(9, 15, { message: 'El teléfono debe tener entre 9 y 15 caracteres' })
  telefono: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'Formato de correo inválido' })
  correo_electronico: string;

  // Usamos el DTO importado
  @ValidateNested() //valida las propiedades del objeto anidado
  @Type(() => CreateHistorialMedicoDto)
  @IsNotEmpty({ message: 'Los datos del historial médico son obligatorios' })
  historial_medico: CreateHistorialMedicoDto;
}
