// src/modules/resultado-analisis/resultado-analisis.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultadoAnalisis } from '../model/resultado-analisis.entity';
import { CreateResultadoAnalisisDto } from '../dto/create-resultado-analisis.dto';
import { ResultadoAnalisisMapper } from '../mapper/resultado-analisis.mapper';
import { UpdateResultadoAnalisisDto } from '../dto/update-resultado-analisis.dto';

@Injectable()
export class ResultadoAnalisisService {
  constructor(
    @InjectRepository(ResultadoAnalisis)
    private repo: Repository<ResultadoAnalisis>,
  ) {}

  private async generateNextId(): Promise<string> {
    const last = await this.repo
      .createQueryBuilder('r')
      .orderBy('r.id_resultado_analisis', 'DESC')
      .getOne();

    let next = 1;
    if (last?.id_resultado_analisis) {
      // Usamos substring(3) por el prefijo "DTA"
      const num = parseInt(last.id_resultado_analisis.substring(3));
      if (!isNaN(num)) next = num + 1;
    }
    // Usamos el prefijo "DTA" como solicitaste
    return `DTA${next.toString().padStart(4, '0')}`;
  }

  async crearResultado(dto: CreateResultadoAnalisisDto) {
    // Validación clave: debe pertenecer a un control
    if (!dto.id_control_diagnostico && !dto.id_control_puerperio) {
      throw new BadRequestException(
        'El resultado debe estar asociado a un control de diagnóstico o de puerperio.',
      );
    }
    
    // Validación de exclusividad (opcional, pero buena práctica)
    if (dto.id_control_diagnostico && dto.id_control_puerperio) {
      throw new BadRequestException(
        'El resultado no puede pertenecer a un control de diagnóstico y puerperio al mismo tiempo.',
      );
    }

    const id = await this.generateNextId();
    const entity = ResultadoAnalisisMapper.toEntity(dto, id);
    return await this.repo.save(entity);
  }

  async actualizarResultado(id: string, dto: UpdateResultadoAnalisisDto) {
    const found = await this.repo.findOne({
      where: { id_resultado_analisis: id },
    });
    if (!found) {
      throw new NotFoundException('Resultado de análisis no encontrado');
    }

    // Actualiza solo los campos que vienen en el DTO
    if (dto.fecha_realizacion)
      found.fecha_realizacion = new Date(dto.fecha_realizacion);
    if (dto.laboratorio) found.laboratorio = dto.laboratorio;
    if (dto.resultado) found.resultado = dto.resultado;
    if (dto.observacion !== undefined)
      found.observacion = dto.observacion ?? null;

    return await this.repo.save(found);
  }

  async obtenerPorId(id: string) {
    const res = await this.repo.findOne({
      where: { id_resultado_analisis: id },
      relations: ['analisis'], // Incluye el nombre del análisis
    });
    if (!res) {
      throw new NotFoundException('Resultado de análisis no encontrado');
    }
    return res;
  }
  
  async listarPorControl(
    idControl: string,
    tipo: 'diagnostico' | 'puerperio',
  ) {
    const whereCondition =
      tipo === 'diagnostico'
        ? { id_control_diagnostico: idControl }
        : { id_control_puerperio: idControl };

    return await this.repo.find({
      where: whereCondition,
      relations: ['analisis'], // Incluye los datos del análisis (nombre, etc.)
      order: {
        fecha_realizacion: 'DESC',
      },
    });
  }

  async eliminarResultado(id: string) {
    const res = await this.repo.delete({ id_resultado_analisis: id });
    if (res.affected === 0) {
      throw new NotFoundException('Resultado de análisis no encontrado');
    }
    return res;
  }
}