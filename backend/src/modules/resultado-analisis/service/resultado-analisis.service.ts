import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException, 
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
      const num = parseInt(last.id_resultado_analisis.substring(3));
      if (!isNaN(num)) next = num + 1;
    }
    return `DTA${next.toString().padStart(4, '0')}`;
  }

  async crearResultado(dto: CreateResultadoAnalisisDto) {

    if (!dto.id_control_diagnostico && !dto.id_control_puerperio) {
      throw new BadRequestException(
        'El resultado debe estar asociado a un control de diagnóstico o de puerperio.',
      );
    }
    if (dto.id_control_diagnostico && dto.id_control_puerperio) {
      throw new BadRequestException(
        'El resultado no puede pertenecer a un control de diagnóstico y puerperio al mismo tiempo.',
      );
    }
    const id = await this.generateNextId();
    const entity = ResultadoAnalisisMapper.toEntity(dto, id);
    return await this.repo.save(entity);
  }

  
  /**
   * Actualiza un registro de resultado para añadir la ruta del PDF.
   * @param id El ID del resultado de análisis (DTAXXXX)
   * @param nombreArchivo El nombre del archivo generado por Multer
   * @returns El registro actualizado
   */
  async guardarRutaPdf(id: string, nombreArchivo: string): Promise<ResultadoAnalisis> {
    const resultado = await this.repo.findOneBy({ id_resultado_analisis: id });
    if (!resultado) {
      throw new NotFoundException(`Resultado de análisis con ID ${id} no encontrado.`);
    }

    resultado.ruta_pdf = nombreArchivo; // Guardamos solo el nombre del archivo
    return await this.repo.save(resultado);
  }
 

  async actualizarResultado(id: string, dto: UpdateResultadoAnalisisDto) {
    const found = await this.repo.findOne({
      where: { id_resultado_analisis: id },
    });
    
    if (!found) {
      throw new NotFoundException('Resultado de análisis no encontrado');
    }

    // --- INICIO DE LA VALIDACIÓN 48 HORAS ---
    const ahora = new Date();
    const fechaRegistro = found.fecha_registro; // Esta es la fecha de creación
    
    const diffMs = ahora.getTime() - fechaRegistro.getTime();
    
    const diffHoras = diffMs / (1000 * 60 * 60);

    const LIMITE_HORAS = 48;

    if (diffHoras > LIMITE_HORAS) {
      throw new ForbiddenException(
        `No se puede editar este resultado. El período de edición de ${LIMITE_HORAS} horas ha expirado.`
      );
    }
    // Si la validación pasa, aplica los cambios
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
      relations: [
        'analisis', 
        'controlMedicoDiagnostico', 
        'controlMedicoPuerperio'  
      ], 
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
      relations: ['analisis'], 
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

  
  async listarPorPrograma(
    idPrograma: string,
    tipo: 'diagnostico' | 'puerperio',
  ) {
    const qb = this.repo.createQueryBuilder('resultado')
      .leftJoinAndSelect('resultado.analisis', 'analisis');

    if (tipo === 'diagnostico') {
      qb.leftJoin('resultado.controlMedicoDiagnostico', 'control')
        .where('control.id_programadiagnostico = :idPrograma', { idPrograma });
    } else {
      qb.leftJoin('resultado.controlMedicoPuerperio', 'control')
        .where('control.id_programapuerperio = :idPrograma', { idPrograma });
    }

    return await qb
      .orderBy('resultado.fecha_realizacion', 'DESC')
      .getMany();
  }
}