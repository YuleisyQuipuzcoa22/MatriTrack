import { ResponseHistorialMedicoDto } from 'src/modules/historial-medico/Dto/response-historialMedico.dto';
import { Paciente } from '../model/paciente.entity';
import { ResponsePacienteDto } from '../dto/response-paciente.dto';
import { HistorialMedicoMapper } from 'src/modules/historial-medico/mapper/historialMedico.mapper';

export class PacienteMapper {
  // Mapear entidad a DTO de respuesta
  static toResponseDto(
    paciente: Paciente,
    incluirHistorial = false,
  ): ResponsePacienteDto {
    const responseDto: ResponsePacienteDto = {
      id_paciente: paciente.id_paciente,
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      dni: paciente.dni,
      fecha_nacimiento: paciente.fecha_nacimiento,
      edad: paciente.calcularEdad(),
      direccion: paciente.direccion,
      sexo: paciente.sexo,
      telefono: paciente.telefono,
      correo_electronico: paciente.correo_electronico,
      estado: paciente.estado,
      fecha_inhabilitacion: paciente.fecha_inhabilitacion,
    };

    if (incluirHistorial && paciente.historial_medico) {
      responseDto.historial_medico = HistorialMedicoMapper.toResponseDto(
        paciente.historial_medico,
      );
    }

    return responseDto;
  }

  // Mapear lista de entidades a lista de DTOs
  static toResponseDtoList(
    pacientes: Paciente[],
    incluirHistorial = false,
  ): ResponsePacienteDto[] {
    return pacientes.map((paciente) =>
      this.toResponseDto(paciente, incluirHistorial),
    );
  }

  // convierte un dto de creacion(create) a una entidad, sin guardar en la base de datos
  static toEntity(createDto: any, id: string): Paciente {
    const paciente = new Paciente();
    //atributos de la entidad = atributos del dto
    paciente.id_paciente = id;
    paciente.nombre = createDto.nombre;
    paciente.apellido = createDto.apellido;
    paciente.dni = createDto.dni;
    paciente.fecha_nacimiento = new Date(createDto.fecha_nacimiento);
    paciente.direccion = createDto.direccion;
    paciente.sexo = createDto.sexo;
    paciente.telefono = createDto.telefono;
    paciente.correo_electronico = createDto.correo_electronico;
    return paciente;
  }

  // Actualizar entidad existente con DTO de actualización
  static updateEntity(paciente: Paciente, updateDto: any): Paciente {
    //atributos de la entidad = atributos del dto, convierte dto a entidad
    if (updateDto.nombre) paciente.nombre = updateDto.nombre;
    if (updateDto.apellido) paciente.apellido = updateDto.apellido;
    if (updateDto.fecha_nacimiento) {
      paciente.fecha_nacimiento = new Date(updateDto.fecha_nacimiento);
    }
    if (updateDto.direccion) paciente.direccion = updateDto.direccion;
    if (updateDto.sexo) paciente.sexo = updateDto.sexo;
    if (updateDto.telefono) paciente.telefono = updateDto.telefono;
    if (updateDto.correo_electronico) {
      paciente.correo_electronico = updateDto.correo_electronico;
    }
    if (updateDto.estado) {
      paciente.estado = updateDto.estado;
    }
    if (updateDto.fecha_inhabilitacion) {
      paciente.fecha_inhabilitacion = new Date(updateDto.fecha_inhabilitacion);
    }
    return paciente;
  }
}
