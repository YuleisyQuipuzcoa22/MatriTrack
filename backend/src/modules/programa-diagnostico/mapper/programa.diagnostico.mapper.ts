import { ProgramaDiagnostico } from '../model/programa_diagnostico.entity';
import { CreateProgramaDiagnosticoDto } from '../Dto/create-programa.diagnostico.dto';
import { UpdateProgramaDiagnosticoDto } from '../Dto/update-programa-diagnostico.dto';
import { Estado } from 'src/enums/Estado';
import { ProgramaDiagnosticoResponseDto } from '../Dto/response-programa-diagnostico.dto';

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
    programa.factor_riesgo = dto.factor_riesgo || null;
    programa.observacion = dto.observacion || null;
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

  static toResponseDto(
    programa: ProgramaDiagnostico,
    incluirPaciente = false,
  ): ProgramaDiagnosticoResponseDto {
    const response: ProgramaDiagnosticoResponseDto = {
      id_programadiagnostico: programa.id_programadiagnostico,
      id_historialmedico: programa.id_historialmedico,
      numero_gestacion: programa.numero_gestacion,
      fecha_inicio: programa.fecha_inicio,
      fecha_probableparto: programa.fecha_probableparto,
      factor_riesgo: programa.factor_riesgo,
      observacion: programa.observacion,
      estado: programa.estado,
      fecha_finalizacion: programa.fecha_finalizacion,
      motivo_finalizacion: programa.motivo_finalizacion,
      motivo_otros: programa.motivo_otros,
    };
    //Incluir datos del paciente si están disponibles
    if (incluirPaciente && programa.historialMedico?.paciente) {
      const paciente = programa.historialMedico.paciente;
      response.paciente = {
        id_paciente: paciente.id_paciente,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        dni: paciente.dni,
        edad: paciente.calcularEdad?.() || 0,
      };
    }

    return response;
  }

  //Lista de entidades → Lista de DTOs
  static toResponseDtoList(
    programas: ProgramaDiagnostico[],
    incluirPaciente = false,
  ): ProgramaDiagnosticoResponseDto[] {
    return programas.map((p) => this.toResponseDto(p, incluirPaciente));
  }
}
