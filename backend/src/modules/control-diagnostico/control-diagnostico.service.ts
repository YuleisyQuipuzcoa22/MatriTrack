// src/modules/control-diagnostico/control-diagnostico.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlDiagnostico } from './model/control_diagnostico.entity';
import { ProgramaDiagnostico } from '../programa-diagnostico/model/programa_diagnostico.entity';
import { UpdateControlDiagnosticoDto } from './Dto/update-control-diagnostico.dt';
import { CreateControlDiagnosticoDto } from './Dto/create-control-diagnostico.dto';
import { ControlDiagnosticoMapper } from './mapper/control-diagnostico.mapper';
import { Estado } from 'src/enums/Estado';
import { QueryControlDiagnosticoDto } from './Dto/query-control-diagnostico.dto';

@Injectable()
export class ControlDiagnosticoService {
  constructor(
    @InjectRepository(ControlDiagnostico)
    private controlDiagnosticoRepository: Repository<ControlDiagnostico>,

    @InjectRepository(ProgramaDiagnostico)
    private programaRepo: Repository<ProgramaDiagnostico>,
  ) {}

  // GENERAR ID AUTOMÁTICO (CD00001, CD00002, ...)
  private async generateNextControlId(): Promise<string> {
    const lastControl = await this.controlDiagnosticoRepository
      .createQueryBuilder('control')
      .orderBy('id_control_diagnostico', 'DESC')
      .getOne();

    let nextIdNumber = 1;
    if (lastControl?.id_control_diagnostico) {
      const currentNumber = parseInt(
        lastControl.id_control_diagnostico.substring(2),
      );
      if (!isNaN(currentNumber)) {
        nextIdNumber = currentNumber + 1;
      }
    }
    return `CD${nextIdNumber.toString().padStart(5, '0')}`;
  }

  // CREAR NUEVO CONTROL
  async create(
    id_programa: string,
    id_usuario: string,
    createDto: CreateControlDiagnosticoDto,
  ) {
    return await this.controlDiagnosticoRepository.manager.transaction(
      async (manager) => {
        const programa = await manager.findOne(ProgramaDiagnostico, {
          where: { id_programadiagnostico: id_programa },
        });
        if (!programa)
          throw new NotFoundException(
            `Programa diagnóstico ${id_programa} no encontrado`,
          );
        if (programa.estado !== Estado.ACTIVO)
          throw new BadRequestException(
            `El programa no está activo (${programa.estado})`,
          );

        const id_control = await this.generateNextControlId();
        const nuevoControl = ControlDiagnosticoMapper.toEntity(
          createDto,
          id_control,
          id_programa,
          id_usuario,
        );
        return await manager.save(ControlDiagnostico, nuevoControl);
      },
    );
  }

  // LISTAR TODOS LOS CONTROLES DE UN PROGRAMA
async findAllByPrograma(id_programa: string, queryDto: QueryControlDiagnosticoDto) {
  let {
    page = 1,
    limit = 10,
    fechaInicio,
    fechaFin,
    order = 'DESC',
  } = queryDto;

  const pageN  = Math.max(1, Number(page)  || 1);
  const limitN = Math.max(1, Math.min(100, Number(limit) || 10));
  const skip   = (pageN - 1) * limitN;

  const fi = fechaInicio ? new Date(`${fechaInicio}T00:00:00`) : undefined;
  const ff = fechaFin    ? new Date(`${fechaFin}T23:59:59.999`) : undefined;

  const programa = await this.programaRepo.findOne({
    where: { id_programadiagnostico: id_programa },
  });
  if (!programa) {
    throw new NotFoundException(`Programa diagnóstico con ID ${id_programa} no encontrado`);
  }

  const qb = this.controlDiagnosticoRepository
    .createQueryBuilder('control')
    .leftJoinAndSelect('control.usuario', 'usuario')
    .where('control.id_programadiagnostico = :id_programa', { id_programa });

  if (fi && ff) {
    qb.andWhere('control.fecha_controldiagnostico BETWEEN :fi AND :ff', { fi, ff });
  } else if (fi) {
    qb.andWhere('control.fecha_controldiagnostico >= :fi', { fi });
  } else if (ff) {
    qb.andWhere('control.fecha_controldiagnostico <= :ff', { ff });
  }

  qb.orderBy('control.fecha_controldiagnostico', order as 'ASC'|'DESC')
    .skip(skip)
    .take(limitN);

  console.log('Params:', { pageN, limitN, skip, fi, ff, order });
  console.log('SQL:', qb.getSql());
  console.log('SQL params:', qb.getParameters());

  const [controles, total] = await qb.getManyAndCount();

  return {
    message: 'Controles obtenidos correctamente',
    data: controles,
    meta: {
      total,
      page: pageN,
      limit: limitN,
      totalPages: Math.ceil(total / limitN),
      hasNextPage: pageN < Math.ceil(total / limitN),
      hasPrevPage: pageN > 1,
    },
  };
}
  // OBTENER UN CONTROL POR ID
  async findOne(id_control: string): Promise<ControlDiagnostico> {
    const control = await this.controlDiagnosticoRepository.findOne({
      where: { id_control_diagnostico: id_control },
      relations: ['programaDiagnostico', 'usuario'],
    });

    if (!control) {
      throw new NotFoundException(
        `Control diagnóstico con ID ${id_control} no encontrado`,
      );
    }
    return control;
  }

  // ACTUALIZAR UN CONTROL
  async update(
    id_control: string,
    updateDto: UpdateControlDiagnosticoDto,
  ): Promise<ControlDiagnostico> {
    const control = await this.controlDiagnosticoRepository.findOne({
      where: { id_control_diagnostico: id_control },
    });

    if (!control) {
      throw new NotFoundException(
        `Control diagnóstico con ID ${id_control} no encontrado`,
      );
    }

    // Usar el mapper para aplicar los cambios
    const controlActualizado = ControlDiagnosticoMapper.updateEntity(
      control,
      updateDto,
    );

    return await this.controlDiagnosticoRepository.save(controlActualizado);
  }
}
