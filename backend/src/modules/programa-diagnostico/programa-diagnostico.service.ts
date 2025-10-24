import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProgramaDiagnostico } from "./model/programa_diagnostico.entity";
import { HistorialMedico } from "../historial-medico/model/historial_medico.entity";
import { CreateProgramaDiagnosticoDto } from "./Dto/create-programa.diagnostico.dto";
import { UpdateProgramaDiagnosticoDto } from "./Dto/update-programa-diagnostico.dto";
import { FinalizarProgramaDiagnosticoDto } from "./Dto/finalizar-programa-diagnostico.dto";
import { ProgramaDiagnosticoMapper } from "./mapper/programa.diagnostico.mapper";
import { Estado } from "src/enums/Estado";
import { MotivoFin } from "src/enums/MotivoFin";
import { Repository } from "typeorm";

@Injectable()
export class ProgramaDiagnosticoService {
  constructor(
    @InjectRepository(ProgramaDiagnostico)
    private programaDiagnosticoRepository: Repository<ProgramaDiagnostico>,
    
    @InjectRepository(HistorialMedico)
    private historialMedicoRepository: Repository<HistorialMedico>,
  ) {}

  // GENERAR ID AUTOMÁTICO (PD00001, PD00002, ...)
  private async generateNextProgramaId(): Promise<string> {
    const lastPrograma = await this.programaDiagnosticoRepository
      .createQueryBuilder('programa')
      .orderBy('id_programadiagnostico', 'DESC')
      .getOne();

    let nextIdNumber = 1;
    if (lastPrograma?.id_programadiagnostico) {
      const currentNumber = parseInt(lastPrograma.id_programadiagnostico.substring(2));
      if (!isNaN(currentNumber)) {
        nextIdNumber = currentNumber + 1;
      }
    }
    return `PD${nextIdNumber.toString().padStart(5, '0')}`;
  }

  // CREAR PROGRAMA DIAGNÓSTICO (recibe id_historialmedico como parámetro)
  async create(
    id_historialmedico: string, 
    createDto: CreateProgramaDiagnosticoDto
  ): Promise<ProgramaDiagnostico> {
    // Verificar que el historial médico exista
    const historial = await this.historialMedicoRepository.findOne({
      where: { id_historialmedico },
      relations: ['paciente'],
    });

    if (!historial) {
      throw new NotFoundException('Historial médico no encontrado');
    }

    // Verificar que no haya un programa activo para este historial
    const programaActivo = await this.programaDiagnosticoRepository.findOne({
      where: {
        id_historialmedico,
        estado: Estado.ACTIVO,
      },
    });

    if (programaActivo) {
      throw new ConflictException(
        `Ya existe un programa de diagnóstico activo para el paciente ${historial.paciente.nombre} ${historial.paciente.apellido}`
      );
    }

    // Generar ID y usar el mapper para crear la entidad
    const id = await this.generateNextProgramaId();
    const nuevoPrograma = ProgramaDiagnosticoMapper.toEntity(
      createDto, 
      id, 
      id_historialmedico // Ahora el mapper recibe el ID
    );

    return await this.programaDiagnosticoRepository.save(nuevoPrograma);
  }

  // CREAR PROGRAMA AUTOMÁTICAMENTE (cuando se crea el historial)
  async createAutomatico(id_historialmedico: string): Promise<ProgramaDiagnostico> {
    const defaultDto: CreateProgramaDiagnosticoDto = {
      numero_gestacion: 1, // Primera gestación por defecto
      fecha_probableparto: undefined,
      factor_riesgo: undefined,
      observacion: undefined,
    };

    return this.create(id_historialmedico, defaultDto);
  }

  // LISTAR TODOS (con filtros opcionales)
  async findAll(dni?: string, nombre?: string, estado?: Estado) {
    const query = this.programaDiagnosticoRepository
      .createQueryBuilder('programa')
      .leftJoinAndSelect('programa.historialMedico', 'historial')
      .leftJoinAndSelect('historial.paciente', 'paciente')
      .orderBy('programa.fecha_inicio', 'DESC');

    if (dni) {
      query.andWhere('paciente.dni LIKE :dni', { dni: `%${dni}%` });
    }

    if (nombre) {
      query.andWhere(
        '(paciente.nombre LIKE :nombre OR paciente.apellido LIKE :nombre)',
        { nombre: `%${nombre}%` }
      );
    }

    if (estado) {
      query.andWhere('programa.estado = :estado', { estado });
    }

    return await query.getMany();
  }

  // OBTENER UNO POR ID
  async findOne(id: string) {
    const programa = await this.programaDiagnosticoRepository.findOne({
      where: { id_programadiagnostico: id },
      relations: ['historialMedico', 'historialMedico.paciente'],
    });

    if (!programa) {
      throw new NotFoundException('Programa diagnóstico no encontrado');
    }

    return programa;
  }

  // ACTUALIZAR PROGRAMA
  async update(id: string, updateDto: UpdateProgramaDiagnosticoDto): Promise<ProgramaDiagnostico> {
    const programa = await this.programaDiagnosticoRepository.findOne({
      where: { id_programadiagnostico: id },
    });

    if (!programa) {
      throw new NotFoundException('Programa diagnóstico no encontrado');
    }

    if (programa.estado !== Estado.ACTIVO) {
      throw new BadRequestException('Solo se pueden editar programas en estado ACTIVO');
    }

    const programaActualizado = ProgramaDiagnosticoMapper.updateEntity(programa, updateDto);

    return await this.programaDiagnosticoRepository.save(programaActualizado);
  }

  // FINALIZAR PROGRAMA
  async finalizar(id: string, finalizarDto: FinalizarProgramaDiagnosticoDto): Promise<ProgramaDiagnostico> {
    const programa = await this.programaDiagnosticoRepository.findOne({
      where: { id_programadiagnostico: id },
    });

    if (!programa) {
      throw new NotFoundException('Programa diagnóstico no encontrado');
    }

    if (programa.estado === Estado.FINALIZADO) {
      throw new BadRequestException('El programa ya está finalizado');
    }

    if (finalizarDto.motivo_finalizacion === MotivoFin.OTROS && !finalizarDto.motivo_otros) {
      throw new BadRequestException('Debe especificar el motivo cuando selecciona "OTROS"');
    }

    programa.estado = Estado.FINALIZADO;
    programa.fecha_finalizacion = new Date();
    programa.motivo_finalizacion = finalizarDto.motivo_finalizacion;
    programa.motivo_otros = finalizarDto.motivo_finalizacion === MotivoFin.OTROS 
      ? (finalizarDto.motivo_otros || null) 
      : null;

    return await this.programaDiagnosticoRepository.save(programa);
  }

  // ACTIVAR PROGRAMA
  async activar(id: string): Promise<ProgramaDiagnostico> {
    const programa = await this.programaDiagnosticoRepository.findOne({
      where: { id_programadiagnostico: id },
    });

    if (!programa) {
      throw new NotFoundException('Programa diagnóstico no encontrado');
    }

    if (programa.estado === Estado.ACTIVO) {
      throw new BadRequestException('El programa ya está activo');
    }

    const programaActivo = await this.programaDiagnosticoRepository.findOne({
      where: {
        id_historialmedico: programa.id_historialmedico,
        estado: Estado.ACTIVO,
      },
    });

    if (programaActivo) {
      throw new ConflictException('Ya existe un programa activo para este paciente');
    }

    programa.estado = Estado.ACTIVO;
    programa.fecha_finalizacion = null;
    programa.motivo_finalizacion = null;
    programa.motivo_otros = null;

    return await this.programaDiagnosticoRepository.save(programa);
  }
}