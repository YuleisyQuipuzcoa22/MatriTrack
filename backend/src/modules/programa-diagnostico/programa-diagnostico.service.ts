import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramaDiagnostico } from './model/programa_diagnostico.entity';
import { HistorialMedico } from '../historial-medico/model/historial_medico.entity';
import { CreateProgramaDiagnosticoDto } from './Dto/create-programa.diagnostico.dto';
import { UpdateProgramaDiagnosticoDto } from './Dto/update-programa-diagnostico.dto';
import { FinalizarProgramaDiagnosticoDto } from './Dto/finalizar-programa-diagnostico.dto';
import { ProgramaDiagnosticoMapper } from './mapper/programa.diagnostico.mapper';
import { Estado } from 'src/enums/Estado';
import { MotivoFin } from 'src/enums/MotivoFin';
import { Repository } from 'typeorm';
import { ProgramaDiagnosticoResponseDto } from './Dto/response-programa-diagnostico.dto';
import { QueryProgramaDiagnosticoDto } from './Dto/QueryProgramaDiagnostico.dto';

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
      const currentNumber = parseInt(
        lastPrograma.id_programadiagnostico.substring(2),
      );
      if (!isNaN(currentNumber)) {
        nextIdNumber = currentNumber + 1;
      }
    }
    return `PD${nextIdNumber.toString().padStart(5, '0')}`;
  }

  // CREAR PROGRAMA DIAGNÓSTICO (recibe id_historialmedico como parámetro)
  async create(
    id_historialmedico: string,
    createDto: CreateProgramaDiagnosticoDto,
  ): Promise<ProgramaDiagnosticoResponseDto> {
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
        `Ya existe un programa de diagnóstico activo para el paciente ${historial.paciente.nombre} ${historial.paciente.apellido}`,
      );
    }

    // Generar ID y usar el mapper para crear la entidad
    const id = await this.generateNextProgramaId();
    const nuevoPrograma = ProgramaDiagnosticoMapper.toEntity(
      createDto,
      id,
      id_historialmedico, // Ahora el mapper recibe el ID
    );
    nuevoPrograma.fecha_inicio = new Date();

    const programaGuardado =
      await this.programaDiagnosticoRepository.save(nuevoPrograma);

    //Cargar relaciones y mapear
    const programaCompleto = await this.programaDiagnosticoRepository.findOne({
      where: {
        id_programadiagnostico: programaGuardado.id_programadiagnostico,
      },
      relations: ['historialMedico', 'historialMedico.paciente'],
    });

    return ProgramaDiagnosticoMapper.toResponseDto(programaCompleto!, true);
  }

  //ESTE NO CREO XXXX
  // CREAR PROGRAMA AUTOMÁTICAMENTE (cuando se crea el historial)
  /*
  async createAutomatico(
    id_historialmedico: string,
  ): Promise<ProgramaDiagnostico> {
    const defaultDto: CreateProgramaDiagnosticoDto = {
      numero_gestacion: 1, // Primera gestación por defecto
      fecha_probableparto: undefined,
      factor_riesgo: undefined,
      observacion: undefined,
    };

    return this.create(id_historialmedico, defaultDto);
  }*/

  // LISTAR TODOS (con filtros opcionales)
  async findAll(queryDto: QueryProgramaDiagnosticoDto) {
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

    // Calcular offset
    const skip = (page - 1) * limit;

    // Query builder
    const queryBuilder = this.programaDiagnosticoRepository
      .createQueryBuilder('programa')
      .leftJoinAndSelect('programa.historialMedico', 'historial')
      .leftJoinAndSelect('historial.paciente', 'paciente');

    //FILTRO: Nombre y apellido del paciente (búsqueda combinada)
    if (nombreApellido) {
      const search = nombreApellido.trim().toUpperCase();
      queryBuilder.andWhere(
        "CONCAT(UPPER(paciente.nombre), ' ', UPPER(paciente.apellido)) LIKE :nombreApellido",
        { nombreApellido: `%${search}%` },
      );
    }

    //FILTRO: DNI del paciente
    if (dni) {
      queryBuilder.andWhere('paciente.dni LIKE :dni', { dni: `%${dni}%` });
    }

    //FILTRO: Estado del paciente
    if (estadoPaciente) {
      queryBuilder.andWhere('paciente.estado = :estadoPaciente', {
        estadoPaciente,
      });
    }

    //FILTRO: Estado del programa (ACTIVO o FINALIZADO)
    if (estadoPrograma) {
      queryBuilder.andWhere('programa.estado = :estadoPrograma', {
        estadoPrograma,
      });
    }

    // ORDENAMIENTO
    const validSortFields = ['fecha_inicio', 'estado'];
    const sortField = validSortFields.includes(sortBy)
      ? sortBy
      : 'fecha_inicio';
    queryBuilder.orderBy(`programa.${sortField}`, order);

    //PAGINACIÓN
    const [programas, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // MAPEAR A DTOs
    const data = ProgramaDiagnosticoMapper.toResponseDtoList(programas, true);

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

  // OBTENER UNO POR ID
  async findOne(id: string): Promise<ProgramaDiagnosticoResponseDto> {
    const programa = await this.programaDiagnosticoRepository.findOne({
      where: { id_programadiagnostico: id },
      relations: ['historialMedico', 'historialMedico.paciente'],
    });

    if (!programa) {
      throw new NotFoundException('Programa diagnóstico no encontrado');
    }

    //Mapear a DTO con datos del paciente
    return ProgramaDiagnosticoMapper.toResponseDto(programa, true);
  }
  //OBTENER PACIENTES DISPONIBLES (sin programa activo/sin programa)
  async getPacientesDisponibles(busqueda?: string) {
    const queryBuilder = this.historialMedicoRepository
      .createQueryBuilder('historial')
      .leftJoinAndSelect('historial.paciente', 'paciente')
      .leftJoin(
        'historial.programasDiagnostico',
        'programa',
        'programa.estado = :estadoActivo',
        { estadoActivo: Estado.ACTIVO },
      )
      .where('programa.id_programadiagnostico IS NULL') // Sin programa activo
      .andWhere('paciente.estado = :estadoPaciente', {
        estadoPaciente: Estado.ACTIVO,
      });

    // Búsqueda por nombre, apellido o DNI
    if (busqueda) {
      const search = busqueda.trim();
      queryBuilder.andWhere(
        '(paciente.nombre LIKE :busqueda OR paciente.apellido LIKE :busqueda OR paciente.dni LIKE :busqueda)',
        { busqueda: `%${search}%` },
      );
    }

    queryBuilder.orderBy('paciente.nombre', 'ASC');

    const historiales = await queryBuilder.getMany();

    // Mapear a formato simple para el buscador
    return historiales.map((h) => ({
      id_historialmedico: h.id_historialmedico,
      id_paciente: h.paciente.id_paciente,
      nombre_completo: `${h.paciente.nombre} ${h.paciente.apellido}`,
      dni: h.paciente.dni,
      edad: h.paciente.calcularEdad?.() || 0,
    }));
  }
  // ACTUALIZAR PROGRAMA
  async update(
    id: string,
    updateDto: UpdateProgramaDiagnosticoDto,
  ): Promise<ProgramaDiagnosticoResponseDto> {
    const programa = await this.programaDiagnosticoRepository.findOne({
      where: { id_programadiagnostico: id },
    });

    if (!programa) {
      throw new NotFoundException('Programa diagnóstico no encontrado');
    }

    if (programa.estado !== Estado.ACTIVO) {
      throw new BadRequestException(
        'Solo se pueden editar programas en estado ACTIVO',
      );
    }

    const programaActualizado = ProgramaDiagnosticoMapper.updateEntity(
      programa,
      updateDto,
    );

    const programaGuardado =
      await this.programaDiagnosticoRepository.save(programaActualizado);

    //Cargar relaciones y mapear
    const programaCompleto = await this.programaDiagnosticoRepository.findOne({
      where: {
        id_programadiagnostico: programaGuardado.id_programadiagnostico,
      },
      relations: ['historialMedico', 'historialMedico.paciente'],
    });

    return ProgramaDiagnosticoMapper.toResponseDto(programaCompleto!, true);
  }

  // FINALIZAR PROGRAMA
  async finalizar(
    id: string,
    finalizarDto: FinalizarProgramaDiagnosticoDto,
  ): Promise<ProgramaDiagnosticoResponseDto> {
    const programa = await this.programaDiagnosticoRepository.findOne({
      where: { id_programadiagnostico: id },
    });

    if (!programa) {
      throw new NotFoundException('Programa diagnóstico no encontrado');
    }

    if (programa.estado === Estado.FINALIZADO) {
      throw new BadRequestException('El programa ya está finalizado');
    }

    if (
      finalizarDto.motivo_finalizacion === MotivoFin.OTROS &&
      !finalizarDto.motivo_otros
    ) {
      throw new BadRequestException(
        'Debe especificar el motivo cuando selecciona "OTROS"',
      );
    }

    programa.estado = Estado.FINALIZADO;
    programa.fecha_finalizacion = new Date();
    programa.motivo_finalizacion = finalizarDto.motivo_finalizacion;
    programa.motivo_otros =
      finalizarDto.motivo_finalizacion === MotivoFin.OTROS
        ? finalizarDto.motivo_otros || null
        : null;

    const programaGuardado =
      await this.programaDiagnosticoRepository.save(programa);

    //Cargar relaciones y mapear
    const programaCompleto = await this.programaDiagnosticoRepository.findOne({
      where: {
        id_programadiagnostico: programaGuardado.id_programadiagnostico,
      },
      relations: ['historialMedico', 'historialMedico.paciente'],
    });

    return ProgramaDiagnosticoMapper.toResponseDto(programaCompleto!, true);
  }

  // ACTIVAR PROGRAMA
  async activar(id: string): Promise<ProgramaDiagnosticoResponseDto> {
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
      throw new ConflictException(
        'Ya existe un programa activo para este paciente',
      );
    }

    programa.estado = Estado.ACTIVO;
    programa.fecha_finalizacion = null;
    programa.motivo_finalizacion = null;
    programa.motivo_otros = null;

    const programaGuardado =
      await this.programaDiagnosticoRepository.save(programa);

    //Cargar relaciones y mapear
    const programaCompleto = await this.programaDiagnosticoRepository.findOne({
      where: {
        id_programadiagnostico: programaGuardado.id_programadiagnostico,
      },
      relations: ['historialMedico', 'historialMedico.paciente'],
    });

    return ProgramaDiagnosticoMapper.toResponseDto(programaCompleto!, true);
  }
}
