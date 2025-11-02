import { Estado } from 'src/enums/Estado';
import { TipoParto } from 'src/enums/TipoParto';
import { MotivoFinPuerperio } from 'src/enums/MotivoFinPuerperio';

export class ProgramaPuerperioResponseDto {
  id_programapuerperio: string;
  id_historialmedico: string;
  fecha_inicio: Date;
  tipo_parto: TipoParto;
  observacion: string | null;
  complicacion: string | null;
  estado: Estado;
  fecha_finalizacion: Date | null;
  motivo_finalizacion: MotivoFinPuerperio | null;
  motivo_otros: string | null; // Columna añadida

  //Datos anidados del paciente (para listados)
  paciente?: {
    id_paciente: string;
    nombre: string;
    apellido: string;
    dni: string;
    edad: number;
  };
}