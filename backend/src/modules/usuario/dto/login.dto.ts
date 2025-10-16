import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El DNI es obligatorio' })
  @IsString()
  @Length(8, 8, { message: 'El DNI debe tener exactamente 8 caracteres' })
  dni: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  contrasena: string;

  @IsNotEmpty({ message: 'El token reCAPTCHA es obligatorio' })
  @IsString()
  recaptchaToken: string;
}