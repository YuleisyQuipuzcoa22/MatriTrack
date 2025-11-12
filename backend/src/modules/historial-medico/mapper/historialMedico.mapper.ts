import { TipoSangre } from 'src/enums/TipoSangre';
import { CreateHistorialMedicoDto } from '../Dto/create-historialMedico.dto';
import { ResponseHistorialMedicoDto } from '../Dto/response-historialMedico.dto';
import { HistorialMedico } from '../model/historial_medico.entity';
import { UpdateHistorialMedicoDto } from '../Dto/updateHistorialMedico.dto';

export class HistorialMedicoMapper {
  static toResponseDto(historial: HistorialMedico): ResponseHistorialMedicoDto {
    return {
      id_historialmedico: historial.id_historialmedico,
      antecedente_medico: historial.antecedente_medico,
      alergia: historial.alergia,
      tipo_sangre: historial.tipo_sangre,
      fecha_iniciohistorial: historial.fecha_iniciohistorial,
      // Agregando las colecciones de programas
      programasDiagnostico: historial.programasDiagnostico, // Se incluye si fue cargada la relación
      programasPuerperio: historial.programasPuerperio, // Se incluye si fue cargada la relación
    };
  }

  static toEntity(
    createDto: CreateHistorialMedicoDto,
    id: string,
    idPaciente: string,
  ): HistorialMedico {
    const historial = new HistorialMedico();
    historial.id_historialmedico = id;
    historial.id_paciente = idPaciente;
    historial.antecedente_medico = createDto.antecedente_medico || null;
    historial.alergia = createDto.alergia || null;
    historial.tipo_sangre = createDto.tipo_sangre || TipoSangre.O_POSITIVO;
    return historial;
  }

  static updateEntity(
  historial: HistorialMedico,
  updateDto: UpdateHistorialMedicoDto,
): HistorialMedico {
  if (updateDto.antecedente_medico !== undefined) {
    historial.antecedente_medico = updateDto.antecedente_medico || null;
  }
  if (updateDto.alergia !== undefined) {
    historial.alergia = updateDto.alergia || null;
  }
  if (updateDto.tipo_sangre !== undefined) {
    historial.tipo_sangre = updateDto.tipo_sangre;
  }
  return historial;
}
}
