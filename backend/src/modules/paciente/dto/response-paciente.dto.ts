import {
  IsDateString,
  IsEmail,
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Estado } from 'src/enums/Estado';
import { Sexo } from 'src/enums/Sexo';
import { ResponseHistorialMedicoDto } from 'src/modules/historial-medico/Dto/response-historialMedico.dto';

export class ResponsePacienteDto {
  id_paciente: string;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nacimiento: Date;
  edad: number;
  direccion: string;
  sexo: Sexo;
  telefono: string;
  correo_electronico: string;
  estado: Estado;
  fecha_inhabilitacion: Date | null;

  //usamos el dto de historial medico
  historial_medico?: ResponseHistorialMedicoDto;
}
