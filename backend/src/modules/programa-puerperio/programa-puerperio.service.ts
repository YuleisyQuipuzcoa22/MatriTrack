// src/modules/programa-puerperio/programa-puerperio.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramaPuerperio } from './model/programa_puerperio.entity';
import { CreateProgramaPuerperioDto } from './dto/create-programa-puerperio.dto';
import { ProgramaPuerperioMapper } from './mapper/programaPuerperio.mapper';
import { HistorialMedico } from '../historial-medico/model/historial_medico.entity';
import { Estado } from 'src/enums/Estado';
import { ProgramaPuerperioResponseDto } from './dto/response-programa-puerperio.dto';
import { UpdateProgramaPuerperioDto } from './dto/update-programa-puerperio.dto';
import { FinalizarProgramaPuerperioDto } from './dto/finalizar-programa-puerperio.dto';
import { QueryProgramaPuerperioDto } from './dto/QueryProgramaPuerperio.dto';
import { ProgramaDiagnostico } from '../programa-diagnostico/model/programa_diagnostico.entity';
import { MotivoFin } from 'src/enums/MotivoFin';
import { MotivoFinPuerperio } from 'src/enums/MotivoFinPuerperio';

@Injectable()
export class ProgramaPuerperioService {
  constructor(
    @InjectRepository(ProgramaPuerperio)
    private repo: Repository<ProgramaPuerperio>,

    @InjectRepository(HistorialMedico)
    private historialMedicoRepository: Repository<HistorialMedico>,

    @InjectRepository(ProgramaDiagnostico)
    private programaDiagnosticoRepository: Repository<ProgramaDiagnostico>,
  ) {}

  private async generateNextId(): Promise<string> {
    const last = await this.repo
      .createQueryBuilder('p')
      .orderBy('p.id_programapuerperio', 'DESC')
      .getOne();
    let next = 1;
    if (last?.id_programapuerperio) {
      const num = parseInt(last.id_programapuerperio.substring(2));
      if (!isNaN(num)) next = num + 1;
    }
    // Prefijo "PP" (Programa Puerperio) y 5 dígitos
    return `PP${next.toString().padStart(5, '0')}`;
  }

  async create(
    id_historialmedico: string,
    dto: CreateProgramaPuerperioDto,
  ): Promise<ProgramaPuerperioResponseDto> {
    const historial = await this.historialMedicoRepository.findOne({
      where: { id_historialmedico },
      relations: ['paciente'],
    });

    if (!historial) {
      throw new NotFoundException('Historial médico no encontrado');
    }

    const programaActivo = await this.repo.findOne({
      where: {
        id_historialmedico,
        estado: Estado.ACTIVO,
      },
    });

    if (programaActivo) {
      throw new ConflictException(
        `Ya existe un programa de puerperio activo para el paciente ${historial.paciente.nombre} ${historial.paciente.apellido}`,
      );
    }

    const id = await this.generateNextId();
    const entity = ProgramaPuerperioMapper.toEntity(
      dto,
      id,
      id_historialmedico,
    );
    const guardado = await this.repo.save(entity);

    // Adjuntar datos del paciente para la respuesta
    guardado.historialMedico = historial;
    return ProgramaPuerperioMapper.toResponseDto(guardado, true);
  }

  async findAll(queryDto: QueryProgramaPuerperioDto) {
    const {
      page = 1,
      limit = 9,
      nombreApellido,
      dni,
      estadoPaciente,
      estadoPrograma,
      sortBy = 'fecha_inicio',
      order = 'DESC',
    } = queryDto;

    const skip = (page - 1) * limit;

    const queryBuilder = this.repo
      .createQueryBuilder('programa')
      .leftJoinAndSelect('programa.historialMedico', 'historial')
      .leftJoinAndSelect('historial.paciente', 'paciente');

    if (nombreApellido) {
      const search = nombreApellido.trim().toUpperCase();
      queryBuilder.andWhere(
        "CONCAT(UPPER(paciente.nombre), ' ', UPPER(paciente.apellido)) LIKE :nombreApellido",
        { nombreApellido: `%${search}%` },
      );
    }
    if (dni) {
      queryBuilder.andWhere('paciente.dni LIKE :dni', { dni: `%${dni}%` });
    }
    if (estadoPaciente) {
      queryBuilder.andWhere('paciente.estado = :estadoPaciente', {
        estadoPaciente,
      });
    }
    if (estadoPrograma) {
      queryBuilder.andWhere('programa.estado = :estadoPrograma', {
        estadoPrograma,
      });
    }

    // Ordenamiento por campos de 'programa' o 'paciente'
    const validSortFields = {
      fecha_inicio: 'programa.fecha_inicio',
      estado: 'programa.estado',
      paciente: 'paciente.apellido',
    };
    const sortField =
      validSortFields[sortBy] || validSortFields['fecha_inicio'];
    queryBuilder.orderBy(sortField, order);

    const [programas, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const data = ProgramaPuerperioMapper.toResponseDtoList(programas, true);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<ProgramaPuerperioResponseDto> {
    const programa = await this.repo.findOne({
      where: { id_programapuerperio: id },
      relations: ['historialMedico', 'historialMedico.paciente'],
    });

    if (!programa) {
      throw new NotFoundException('Programa de puerperio no encontrado');
    }

    return ProgramaPuerperioMapper.toResponseDto(programa, true);
  }

  // Lógica para encontrar pacientes que terminaron su diagnóstico por PARTO
  // y que NO tienen un programa de puerperio ACTIVO.
  async getPacientesParaPuerperio(busqueda?: string) {
    const queryBuilder = this.programaDiagnosticoRepository
      .createQueryBuilder('diag')
      .leftJoinAndSelect('diag.historialMedico', 'historial')
      .leftJoinAndSelect('historial.paciente', 'paciente')
      // 1. Asegurar que el programa de diagnóstico terminó por PARTO
      .where('diag.estado = :estadoFinalizado', {
        estadoFinalizado: Estado.FINALIZADO,
      })
      .andWhere('diag.motivo_finalizacion = :motivoParto', {
        motivoParto: MotivoFin.PARTO,
      })
      // 2. Asegurar que el paciente esté ACTIVO
      .andWhere('paciente.estado = :estadoPaciente', {
        estadoPaciente: Estado.ACTIVO,
      })
      // 3. Buscar un programa de puerperio ACTIVO para ese historial
      .leftJoin(
        'historial.programasPuerperio',
        'puer',
        'puer.estado = :estadoActivo',
        { estadoActivo: Estado.ACTIVO },
      )
      // 4. Quedarnos solo con los que NO tienen un programa activo (puer.id IS NULL)
      .andWhere('puer.id_programapuerperio IS NULL');

    // Búsqueda por nombre, apellido o DNI
    if (busqueda) {
      const search = busqueda.trim().toUpperCase();
      queryBuilder.andWhere(
        "(CONCAT(UPPER(paciente.nombre), ' ', UPPER(paciente.apellido)) LIKE :busqueda OR paciente.dni LIKE :busqueda)",
        { busqueda: `%${search}%` },
      );
    }

    queryBuilder.orderBy('paciente.apellido', 'ASC');

    const programasTerminados = await queryBuilder.getMany();

    // Mapear a formato simple
    return programasTerminados.map((p) => ({
      id_historialmedico: p.historialMedico.id_historialmedico,
      id_paciente: p.historialMedico.paciente.id_paciente,
      nombre_completo: `${p.historialMedico.paciente.nombre} ${p.historialMedico.paciente.apellido}`,
      dni: p.historialMedico.paciente.dni,
      edad: p.historialMedico.paciente.calcularEdad?.() || 0,
      fecha_parto: p.fecha_finalizacion, // Fecha en que finalizó el programa de diagnóstico
    }));
  }

  async update(
    id: string,
    dto: UpdateProgramaPuerperioDto,
  ): Promise<ProgramaPuerperioResponseDto> {
    const programa = await this.repo.findOne({
      where: { id_programapuerperio: id },
      relations: ['historialMedico', 'historialMedico.paciente'], // Cargar relaciones
    });
    if (!programa) {
      throw new NotFoundException('Programa de puerperio no encontrado');
    }
    if (programa.estado !== Estado.ACTIVO) {
      throw new BadRequestException(
        'Solo se pueden editar programas en estado ACTIVO',
      );
    }

    const actualizado = ProgramaPuerperioMapper.updateEntity(programa, dto);
    const guardado = await this.repo.save(actualizado);

    return ProgramaPuerperioMapper.toResponseDto(guardado, true);
  }

  async finalizar(
    id: string,
    dto: FinalizarProgramaPuerperioDto,
  ): Promise<ProgramaPuerperioResponseDto> {
    const programa = await this.repo.findOne({
      where: { id_programapuerperio: id },
      relations: ['historialMedico', 'historialMedico.paciente'], // Cargar relaciones
    });
    if (!programa) {
      throw new NotFoundException('Programa de puerperio no encontrado');
    }
    if (programa.estado === Estado.FINALIZADO) {
      throw new BadRequestException('El programa ya está finalizado');
    }

    if (
      dto.motivo_finalizacion === MotivoFinPuerperio.OTROS &&
      !dto.motivo_otros
    ) {
      throw new BadRequestException(
        'Debe especificar el motivo cuando selecciona "OTROS"',
      );
    }

    programa.estado = Estado.FINALIZADO;
    programa.fecha_finalizacion = new Date();
    programa.motivo_finalizacion = dto.motivo_finalizacion;
    
    // --- LÍNEA CORREGIDA ---
    // Se asegura de que (string | undefined) se convierta en (string | null)
    programa.motivo_otros =
      dto.motivo_finalizacion === MotivoFinPuerperio.OTROS
        ? dto.motivo_otros ?? null 
        : null;

    const guardado = await this.repo.save(programa);

    return ProgramaPuerperioMapper.toResponseDto(guardado, true);
  }

  async activar(id: string): Promise<ProgramaPuerperioResponseDto> {
    const programa = await this.repo.findOne({
      where: { id_programapuerperio: id },
      relations: ['historialMedico', 'historialMedico.paciente'], // Cargar relaciones
    });
    if (!programa) {
      throw new NotFoundException('Programa de puerperio no encontrado');
    }
    if (programa.estado === Estado.ACTIVO) {
      throw new BadRequestException('El programa ya está activo');
    }

    // Validar que no haya otro activo para el mismo historial
    const programaActivo = await this.repo.findOne({
      where: {
        id_historialmedico: programa.id_historialmedico,
        estado: Estado.ACTIVO,
      },
    });

    if (programaActivo) {
      throw new ConflictException(
        'Ya existe un programa activo para este paciente',
      );
    }

    programa.estado = Estado.ACTIVO;
    programa.fecha_finalizacion = null;
    programa.motivo_finalizacion = null;
    programa.motivo_otros = null;

    const guardado = await this.repo.save(programa);

    return ProgramaPuerperioMapper.toResponseDto(guardado, true);
  }
}