import { 
  IsNotEmpty, 
  IsString, 
  IsEmail, 
  IsEnum, 
  IsDateString,
  Length,
  IsOptional 
} from 'class-validator';
import { RolUsuario } from '../../../enums/RolUsuario';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'El DNI es obligatorio' })
  @IsString()
  @Length(8, 8, { message: 'El DNI debe tener exactamente 8 caracteres' })
  dni: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @Length(2, 50, { message: 'El nombre debe tener máximo 50 caracteres' })
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  @Length(2, 50, { message: 'El apellido debe tener máximo 50 caracteres' })
  apellido: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  contrasena: string;

  @IsNotEmpty({ message: 'El rol es obligatorio' })
  @IsEnum(RolUsuario, { message: 'Rol inválido' })
  rol: RolUsuario;

  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  @IsDateString({}, { message: 'Formato de fecha inválido' })
  fecha_nacimiento: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'Formato de correo inválido' })
  correo_electronico: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString()
  @Length(9, 15, { message: 'El teléfono debe tener máximo 15 caracteres' })
  telefono: string;

  @IsNotEmpty({message: 'La dirección es obligatoria'})
  @IsString()
  @Length(6, 100, {message: 'La dirección no debe exceder los 100 caracteres'})
  direccion?: string;

  @IsNotEmpty({message: 'El número de colegiatura es obligatorio'})
  @IsString()
  @Length(6, 20, { message: 'El número de colegiatura debe tener máximo 20 caracteres' })
  numero_colegiatura?: string;
}