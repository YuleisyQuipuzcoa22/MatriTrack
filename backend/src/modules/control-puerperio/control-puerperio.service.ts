// src/modules/control-puerperio/control-puerperio.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlPuerperio } from './model/control_puerperio.entity';
import { CreateControlPuerperioDto } from './dto/create-control-puerperio.dto';
import { ControlPuerperioMapper } from './mapper/controlPuerperio.mapper';
import { ProgramaPuerperio } from '../programa-puerperio/model/programa_puerperio.entity';
import { Estado } from 'src/enums/Estado';
import { UpdateControlPuerperioDto } from './dto/update-control-puerperio.dto';
import { QueryControlPuerperioDto } from './dto/query-control-puerperio.dto'; // Importar DTO

@Injectable()
export class ControlPuerperioService {
  constructor(
    @InjectRepository(ControlPuerperio)
    private repo: Repository<ControlPuerperio>,

    @InjectRepository(ProgramaPuerperio)
    private programaPuerperioRepository: Repository<ProgramaPuerperio>,
  ) {}

  private async generateNextId(): Promise<string> {
    const last = await this.repo
      .createQueryBuilder('c')
      .orderBy('c.id_control_puerperio', 'DESC')
      .getOne();
    let next = 1;
    if (last?.id_control_puerperio) {
      // Prefijo "CP" (Control Puerperio) y 5 dígitos
      const num = parseInt(last.id_control_puerperio.substring(2));
      if (!isNaN(num)) next = num + 1;
    }
    return `CP${next.toString().padStart(5, '0')}`;
  }

  async create(
    id_programa: string,
    id_usuario: string,
    dto: CreateControlPuerperioDto,
  ): Promise<ControlPuerperio> {
    // 1. Verificar el Programa y su estado
    const programa = await this.programaPuerperioRepository.findOne({
      where: { id_programapuerperio: id_programa },
    });

    if (!programa) {
      throw new NotFoundException(
        `Programa de puerperio con ID ${id_programa} no encontrado`,
      );
    }

    if (programa.estado !== Estado.ACTIVO) {
      throw new BadRequestException(
        `No se puede registrar un control. El programa de puerperio no está ACTIVO (Estado: ${programa.estado})`,
      );
    }

    // 2. Generar ID y Mapear
    const id = await this.generateNextId();
    const entity = ControlPuerperioMapper.toEntity(
      dto,
      id,
      id_programa,
      id_usuario,
    );

    // 3. Guardar
    return await this.repo.save(entity);
  }

  // MODIFICADO: findAllByPrograma
  async findAllByPrograma(
    id_programa: string,
    queryDto: QueryControlPuerperioDto, // Aceptar DTO
  ) {
    const {
      page = 1,
      limit = 10,
      fechaInicio,
      fechaFin,
      order = 'DESC',
    } = queryDto;
    const skip = (page - 1) * limit;

    // 1. Validar que el programa exista
    const programa = await this.programaPuerperioRepository.findOne({
      where: { id_programapuerperio: id_programa },
    });
    if (!programa) {
      throw new NotFoundException(
        `Programa de puerperio con ID ${id_programa} no encontrado`,
      );
    }

    // 2. Crear QueryBuilder
    const queryBuilder = this.repo.createQueryBuilder('control')
      .leftJoinAndSelect('control.usuario', 'usuario')
      .where('control.id_programapuerperio = :id_programa', { id_programa });

    // 3. Aplicar Filtro de Fecha
    if (fechaInicio && fechaFin) {
      // Asegurarse de incluir todo el día final
      const fechaFinAjustada = new Date(fechaFin);
      fechaFinAjustada.setHours(23, 59, 59, 999);
      
      queryBuilder.andWhere(
        'control.fecha_controlpuerperio BETWEEN :fechaInicio AND :fechaFin',
        { fechaInicio, fechaFin: fechaFinAjustada },
      );
    } else if (fechaInicio) {
      queryBuilder.andWhere(
        'control.fecha_controlpuerperio >= :fechaInicio',
        { fechaInicio },
      );
    } else if (fechaFin) {
      const fechaFinAjustada = new Date(fechaFin);
      fechaFinAjustada.setHours(23, 59, 59, 999);
      queryBuilder.andWhere(
        'control.fecha_controlpuerperio <= :fechaFin',
        { fechaFin: fechaFinAjustada },
      );
    }

    // 4. Ordenamiento y Paginación
    queryBuilder
      .orderBy('control.fecha_controlpuerperio', order)
      .skip(skip)
      .take(limit);

    // 5. Obtener resultados
    const [controles, total] = await queryBuilder.getManyAndCount();

    return {
      data: controles, // Los datos ya están filtrados y paginados
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

  async findOne(id_control: string): Promise<ControlPuerperio> {
    const control = await this.repo.findOne({
      where: { id_control_puerperio: id_control },
      relations: ['programaPuerperio', 'usuario'], // Cargar relaciones
    });

    if (!control) {
      throw new NotFoundException(
        `Control de puerperio con ID ${id_control} no encontrado`,
      );
    }
    return control;
  }

  async update(
    id_control: string,
    dto: UpdateControlPuerperioDto,
  ): Promise<ControlPuerperio> {
    const control = await this.repo.findOne({
      where: { id_control_puerperio: id_control },
    });

    if (!control) {
      throw new NotFoundException(
        `Control de puerperio con ID ${id_control} no encontrado`,
      );
    }

    const actualizado = ControlPuerperioMapper.updateEntity(control, dto);

    return await this.repo.save(actualizado);
  }
}