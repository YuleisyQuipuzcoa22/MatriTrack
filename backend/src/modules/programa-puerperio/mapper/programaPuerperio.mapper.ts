// src/modules/programa-puerperio/mapper/programaPuerperio.mapper.ts
import { CreateProgramaPuerperioDto } from '../dto/create-programa-puerperio.dto';
import { ProgramaPuerperioResponseDto } from '../dto/response-programa-puerperio.dto';
import { UpdateProgramaPuerperioDto } from '../dto/update-programa-puerperio.dto';
import { ProgramaPuerperio } from '../model/programa_puerperio.entity';

export class ProgramaPuerperioMapper {
  static toEntity(
    dto: CreateProgramaPuerperioDto,
    id: string,
    id_historialmedico: string, // Añadido
  ): ProgramaPuerperio {
    const p = new ProgramaPuerperio();
    p.id_programapuerperio = id;
    p.id_historialmedico = id_historialmedico; // Asignado desde el parámetro
    p.tipo_parto = dto.tipo_parto;
    p.observacion = dto.observacion ?? null;
    p.complicacion = dto.complicacion ?? null;
    return p;
  }

  static updateEntity(
    programa: ProgramaPuerperio,
    dto: UpdateProgramaPuerperioDto,
  ): ProgramaPuerperio {
    if (dto.tipo_parto !== undefined) {
      programa.tipo_parto = dto.tipo_parto;
    }
    if (dto.observacion !== undefined) {
      programa.observacion = dto.observacion || null;
    }
    if (dto.complicacion !== undefined) {
      programa.complicacion = dto.complicacion || null;
    }
    return programa;
  }

  static toResponseDto(
    programa: ProgramaPuerperio,
    incluirPaciente = false,
  ): ProgramaPuerperioResponseDto {
    const response: ProgramaPuerperioResponseDto = {
      id_programapuerperio: programa.id_programapuerperio,
      id_historialmedico: programa.id_historialmedico,
      fecha_inicio: programa.fecha_inicio,
      tipo_parto: programa.tipo_parto,
      observacion: programa.observacion,
      complicacion: programa.complicacion,
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

  static toResponseDtoList(
    programas: ProgramaPuerperio[],
    incluirPaciente = false,
  ): ProgramaPuerperioResponseDto[] {
    return programas.map((p) => this.toResponseDto(p, incluirPaciente));
  }
}