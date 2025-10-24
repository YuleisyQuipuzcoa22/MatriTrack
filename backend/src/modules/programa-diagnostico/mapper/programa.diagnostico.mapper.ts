import { ProgramaDiagnostico } from '../model/programa_diagnostico.entity';
import { CreateProgramaDiagnosticoDto } from '../Dto/create-programa.diagnostico.dto';
import { UpdateProgramaDiagnosticoDto } from '../Dto/update-programa-diagnostico.dto';
import { Estado } from 'src/enums/Estado';

export class ProgramaDiagnosticoMapper {
  // DTO → Entidad (para crear)
  static toEntity(
    dto: CreateProgramaDiagnosticoDto,
    id_programadiagnostico: string,
    id_historialmedico: string,
  ): ProgramaDiagnostico {
    const programa = new ProgramaDiagnostico();
    programa.id_programadiagnostico = id_programadiagnostico;
    programa.id_historialmedico = id_historialmedico;
    programa.numero_gestacion = dto.numero_gestacion;
    if (dto.fecha_probableparto) {
      programa.fecha_probableparto = new Date(dto.fecha_probableparto);
    }
    if (dto.factor_riesgo) {
      programa.factor_riesgo = dto.factor_riesgo;
    }
    if (dto.observacion) {
      programa.observacion = dto.observacion;
    }
    programa.estado = Estado.ACTIVO;
    return programa;
  }

  static updateEntity(
    programa: ProgramaDiagnostico,
    dto: UpdateProgramaDiagnosticoDto,
  ): ProgramaDiagnostico {
    if (dto.numero_gestacion !== undefined) {
      programa.numero_gestacion = dto.numero_gestacion;
    }
    if (dto.fecha_probableparto !== undefined) {
      if (dto.fecha_probableparto) {
        programa.fecha_probableparto = new Date(dto.fecha_probableparto);
      }
    }

    if (dto.factor_riesgo !== undefined) {
      programa.factor_riesgo = dto.factor_riesgo || null;
    }

    if (dto.observacion !== undefined) {
      programa.observacion = dto.observacion || null;
    }

    return programa;
  }
}
