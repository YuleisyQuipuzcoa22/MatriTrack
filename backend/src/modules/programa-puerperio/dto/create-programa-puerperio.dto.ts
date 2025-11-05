import { TipoParto } from '../../../enums/TipoParto';

export class CreateProgramaPuerperioDto {
  id_historialmedico!: string;
  tipo_parto!: TipoParto;
  observacion?: string;
  complicacion?: string;
}
