import { TipoSangre } from 'src/enums/TipoSangre';
import { ProgramaDiagnostico } from 'src/modules/programa-diagnostico/model/programa_diagnostico.entity';
import { ProgramaPuerperio } from 'src/modules/programa-puerperio/model/programa_puerperio.entity';

export class ResponseHistorialMedicoDto {
  id_historialmedico: string;
  antecedente_medico: string | null;
  alergia: string | null;
  tipo_sangre: TipoSangre;
  fecha_iniciohistorial: Date;
  programasDiagnostico?: ProgramaDiagnostico[];
  programasPuerperio?: ProgramaPuerperio[];
}
