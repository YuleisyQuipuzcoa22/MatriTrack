// src/modules/control-diagnostico/control-diagnostico.service.ts

import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ControlDiagnostico } from "./model/control_diagnostico.entity";
import { ProgramaDiagnostico } from "../programa-diagnostico/model/programa_diagnostico.entity";
import { UpdateControlDiagnosticoDto } from "./Dto/update-control-diagnostico.dt";
import { CreateControlDiagnosticoDto } from "./Dto/create-control-diagnostico.dto";
import { ControlDiagnosticoMapper } from "./mapper/control-diagnostico.mapper";
import { Estado } from "src/enums/Estado";

@Injectable()
export class ControlDiagnosticoService {
  constructor(
    @InjectRepository(ControlDiagnostico)
    private controlDiagnosticoRepository: Repository<ControlDiagnostico>,
    
    @InjectRepository(ProgramaDiagnostico)
    private programaDiagnosticoRepository: Repository<ProgramaDiagnostico>,
  ) {}

  // GENERAR ID AUTOMÁTICO (CD00001, CD00002, ...)
  private async generateNextControlId(): Promise<string> {
    const lastControl = await this.controlDiagnosticoRepository
      .createQueryBuilder('control')
      .orderBy('id_control_diagnostico', 'DESC')
      .getOne();

    let nextIdNumber = 1;
    if (lastControl?.id_control_diagnostico) {
      const currentNumber = parseInt(lastControl.id_control_diagnostico.substring(2));
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
    createDto: CreateControlDiagnosticoDto
  ): Promise<ControlDiagnostico> {
    // 1. Verificar el Programa Diagnóstico y su estado
    const programa = await this.programaDiagnosticoRepository.findOne({
      where: { id_programadiagnostico: id_programa },
    });

    if (!programa) {
      throw new NotFoundException(`Programa diagnóstico con ID ${id_programa} no encontrado`);
    }

    if (programa.estado !== Estado.ACTIVO) {
      throw new BadRequestException(
        `No se puede registrar un control. El programa de diagnóstico no está ACTIVO (Estado: ${programa.estado})`
      );
    }
    
    // 2. Generar ID y Mapear
    const id_control = await this.generateNextControlId();
    
    // Nota: Necesitarás implementar ControlDiagnosticoMapper
    const nuevoControl = ControlDiagnosticoMapper.toEntity(
        createDto, 
        id_control, 
        id_programa, 
        id_usuario
    );

    // 3. Guardar el control
    return await this.controlDiagnosticoRepository.save(nuevoControl);
  }

  // LISTAR TODOS LOS CONTROLES DE UN PROGRAMA
  async findAllByPrograma(id_programa: string): Promise<ControlDiagnostico[]> {
    // No verificamos si el programa existe, si no existe el array estará vacío
    return await this.controlDiagnosticoRepository.find({
      where: { id_programadiagnostico: id_programa },
      relations: ['usuario'], // Para saber qué obstetra lo realizó
      order: { fecha_controldiagnostico: 'DESC' },
    });
  }

  // OBTENER UN CONTROL POR ID
  async findOne(id_control: string): Promise<ControlDiagnostico> {
    const control = await this.controlDiagnosticoRepository.findOne({
      where: { id_control_diagnostico: id_control },
      relations: ['programaDiagnostico', 'usuario'], 
    });

    if (!control) {
      throw new NotFoundException(`Control diagnóstico con ID ${id_control} no encontrado`);
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
      throw new NotFoundException(`Control diagnóstico con ID ${id_control} no encontrado`);
    }

    // Usar el mapper para aplicar los cambios
    const controlActualizado = ControlDiagnosticoMapper.updateEntity(control, updateDto);

    return await this.controlDiagnosticoRepository.save(controlActualizado);
  }
}