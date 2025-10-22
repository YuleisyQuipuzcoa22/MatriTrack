import { TipoSangre } from 'src/enums/TipoSangre';

export class ResponseHistorialMedicoDto {
  id_historialmedico: string;
  antecedente_medico: string | null;
  alergia: string | null;
  tipo_sangre: TipoSangre;
  fecha_iniciohistorial: Date;
}
