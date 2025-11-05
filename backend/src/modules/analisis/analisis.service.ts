import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Analisis } from './model/analisis.entity';
import { Repository } from 'typeorm';
import { CreateAnalisisDto } from './dto/create_analisis.dto';
import { ResponseAnalisisDto } from './dto/response_analisis.dto';
import { AnalisisMapper } from './mapper/analisis.mapper';
import { QueryAnalisisDto } from './dto/QueryAnalisis.dto';
import { Estado } from 'src/enums/Estado';
import { UpdateAnalisisDto } from './dto/update_analisis.dto';

@Injectable()
export class AnalisisService {
  constructor(
    @InjectRepository(Analisis)
    private analisisRepository: Repository<Analisis>,
  ) {}

  //id automatico: AN0001
  private async generateNextAnalisisId(): Promise<string> {
    const lastAnalisis = await this.analisisRepository
      .createQueryBuilder('analisis')
      .orderBy('analisis.id_analisis', 'DESC')
      .getOne();
    let nextIdNumber = 1;
    if (lastAnalisis?.id_analisis) {
      const numericPart = lastAnalisis.id_analisis.substring(2);
      if (!isNaN(parseInt(numericPart))) {
        nextIdNumber = parseInt(numericPart) + 1;
      }
    }
    return `AN${nextIdNumber.toString().padStart(4, '0')}`;
  }

  async registrarAnalisis(
    createAnalisisDto: CreateAnalisisDto,
  ): Promise<ResponseAnalisisDto> {
    try {
      const idAnalisis = await this.generateNextAnalisisId();
      const nuevoAnalisis = AnalisisMapper.toEntity(
        createAnalisisDto,
        idAnalisis,
      );
      const analisisGuardado =
        await this.analisisRepository.save(nuevoAnalisis);

      return AnalisisMapper.toResponseDto(analisisGuardado);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'El nombre de análisis ya está registrado.',
        );
      }
      throw error;
    }
  }

  async listarAnalisis(queryDto: QueryAnalisisDto) {
    const { 
      page = 1, 
      limit = 10, 
      nombreAnalisis, 
      estado,
      sortBy, 
      order 
    } = queryDto;

    // Calcular offset para paginación
    const skip = (page - 1) * limit;
    // Crear query builder
    const queryBuilder = this.analisisRepository.createQueryBuilder('analisis');

    if (nombreAnalisis) {
      const search = nombreAnalisis.trim().toUpperCase();
      queryBuilder.andWhere(
        '(UPPER(analisis.nombre_analisis) LIKE :nombreAnalisis)',
        { nombreAnalisis: `%${search}%` },
      );
    }
    if(estado){
      queryBuilder.andWhere('analisis.estado = :estado', {estado});
    }
    queryBuilder.orderBy(`analisis.${sortBy}`, order);
    const [analisis, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const data = AnalisisMapper.toResponseDtoList(analisis);
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

  async obtenerAnalisisPorId(id: string): Promise<ResponseAnalisisDto> {
    const analisis = await this.analisisRepository.findOne({
      where: { id_analisis: id },
    });
    if (!analisis) {
      throw new NotFoundException(`Analisis con ID ${id} no encontrado`);
    }
    return AnalisisMapper.toResponseDto(analisis);
  }

  //uso el dto de update y no de create porque el atributo "estado" hace la diferencia
  async modificarAnalisis(
    id: string,
    updateAnalisisDto: UpdateAnalisisDto,
  ): Promise<ResponseAnalisisDto> {
    const analisis = await this.analisisRepository.findOneBy({
      id_analisis: id,
    });
    if (!analisis) {
      throw new NotFoundException('Analisis no encontrado');
    }
    const analisisActualizado = AnalisisMapper.updateEntity(
      analisis,
      updateAnalisisDto,
    );
    try {
      const analisisGuardado =
        await this.analisisRepository.save(analisisActualizado);
      return AnalisisMapper.toResponseDto(analisisGuardado);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'El nombre del análisis ya se encuentra registrado',
        );
      }
      throw error;
    }
  }
  
  async inhabilitarAnalisis(id: string): Promise<ResponseAnalisisDto> {
    const analisis = await this.analisisRepository.findOneBy({
      id_analisis: id,
    });
     if (!analisis) {
      throw new NotFoundException('Analisis no encontrado');
    }
    if(analisis.estado === Estado.INACTIVO){
      throw new ConflictException('El análisis ya está inactivo');
    }
    analisis.estado = Estado.INACTIVO;
    const analisisInhabilitado = await this.analisisRepository.save(analisis);
    return AnalisisMapper.toResponseDto(analisisInhabilitado)
  }
}
