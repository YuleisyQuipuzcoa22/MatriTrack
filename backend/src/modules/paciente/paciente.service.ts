import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from './model/paciente.entity';
import { DataSource, Repository } from 'typeorm';

import { Estado } from 'src/enums/Estado';
import { HistorialMedico } from '../historial-medico/model/historial_medico.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { ResponsePacienteDto } from './dto/response-paciente.dto';
import { PacienteMapper } from './mapper/paciente.mapper';
import { HistorialMedicoMapper } from '../historial-medico/mapper/historialMedico.mapper';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
    @InjectRepository(HistorialMedico)
    private historialMedicoRepository: Repository<HistorialMedico>,

    private dataSource: DataSource, // Inyectar DataSource para transacciones
  ) {}

  //generar id automático
  private async generateNextPacienteId(): Promise<string> {
    const lastPaciente = await this.pacienteRepository
      .createQueryBuilder('paciente')
      .orderBy('paciente.id_paciente', 'DESC')
      .getOne();
    let nextIdNumber = 1;
    if (lastPaciente?.id_paciente) {
      const numericPart = lastPaciente.id_paciente.substring(2);
      if (!isNaN(parseInt(numericPart))) {
        nextIdNumber = parseInt(numericPart) + 1;
      }
    }
    return `PA${nextIdNumber.toString().padStart(4, '0')}`;
  }

  //Id automático para historial medico
  private async generateNextHistorialId(): Promise<string> {
    const lastHistorial = await this.historialMedicoRepository
      .createQueryBuilder('historial')
      .orderBy('historial.id_historialmedico', 'DESC')
      .getOne();

    let nextIdNumber = 1;
    if (lastHistorial?.id_historialmedico) {
      const numericPart = lastHistorial.id_historialmedico.substring(2);
      if (!isNaN(parseInt(numericPart))) {
        nextIdNumber = parseInt(numericPart) + 1;
      }
    }
    return `HM${nextIdNumber.toString().padStart(4, '0')}`;
  }

  //registrar paciente con historial medico en una transaccion
  async registrarPaciente(
    createPacienteDto: CreatePacienteDto,
  ): Promise<ResponsePacienteDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generar IDs automáticos
      const idPaciente = await this.generateNextPacienteId();
      const idHistorial = await this.generateNextHistorialId();

      //crear entidad paciente con mapper
      const nuevoPaciente = PacienteMapper.toEntity(
        createPacienteDto,
        idPaciente,
      );

      //guardar paciente
      const pacienteGuardado = await queryRunner.manager.save(
        Paciente,
        nuevoPaciente,
      );

      //crear entidad historial medico con mapper
      const nuevoHistorial = HistorialMedicoMapper.toEntity(
        createPacienteDto.historial_medico,
        idHistorial,
        pacienteGuardado.id_paciente,
      );

      //guardar historial medico
      const historialGuardado = await queryRunner.manager.save(
        HistorialMedico,
        nuevoHistorial,
      );

      //commit de la transaccion
      await queryRunner.commitTransaction();

      //preparar y retornar el DTO de respuesta
      //asignar el historial medico guardado al paciente guardado
      pacienteGuardado.historial_medico = historialGuardado;
      //retorna el paciente con el historial medico incluido(true)
      return PacienteMapper.toResponseDto(pacienteGuardado, true);
    } catch (error) {
      // Si hay un error, hacer rollback de la transacción, o sea deshacer los cambios
      await queryRunner.rollbackTransaction();
      console.error('❌ Error al registrar paciente:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'DNI o correo electrónico ya está registrado',
        );
      }
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release(); // Liberar el query runner
    }
  }

  //listar pacientes con historial medico
  async listarPacientes(): Promise<ResponsePacienteDto[]> {
    const pacientes = await this.pacienteRepository.find({
      relations: ['historial_medico'],
      order: { id_paciente: 'DESC' },
    });
    return PacienteMapper.toResponseDtoList(pacientes, true);
  }

  //obtener paciente por id con historial medico
  async obtenerPacientePorId(id: string): Promise<ResponsePacienteDto> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id_paciente: id },
      relations: ['historial_medico'],
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return PacienteMapper.toResponseDto(paciente, true);
  }

  //modificar paciente (solo datos del paciente, no del historial medico)
  async modificarPaciente(
    id: string,
    updatePacienteDto: UpdatePacienteDto,
  ): Promise<ResponsePacienteDto> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id_paciente: id },
      relations: ['historial_medico'],
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    //toma a updatePacienteDto y conviertelo en entidad paciente con el mapper
    const pacienteActualizado = PacienteMapper.updateEntity(
      paciente,
      updatePacienteDto,
    );
    if (pacienteActualizado.estado === Estado.ACTIVO) {
      pacienteActualizado.fecha_inhabilitacion = null;
    }

    try {
      //ya actualizado, guardalo en la base de datos
      const pacienteGuardado =
        await this.pacienteRepository.save(pacienteActualizado);
      //retorna el paciente guardado (entidad) convertido a dto
      return PacienteMapper.toResponseDto(pacienteGuardado, true);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'DNI o correo electrónico ya está registrado',
        );
      }
      throw new InternalServerErrorException('Error al modificar paciente');
    }
  }

  //inhabilitar paciente
  //promise: te daré un paciente dto
  async inhabilitarPaciente(id: string): Promise<ResponsePacienteDto> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id_paciente: id },
      relations: ['historial_medico'],
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    if (paciente.estado === Estado.INACTIVO) {
      throw new ConflictException('El paciente ya está inactivo');
    }
    paciente.estado = Estado.INACTIVO;
    paciente.fecha_inhabilitacion = new Date();
    const pacienteInhabilitado = await this.pacienteRepository.save(paciente);
    return PacienteMapper.toResponseDto(pacienteInhabilitado, true);
  }
}
