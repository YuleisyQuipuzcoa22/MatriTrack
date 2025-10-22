import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProgramaDiagnostico } from './model/programa_diagnostico.entity';
import { HistorialMedico } from 'src/modules/historial-medico/model/historial_medico.entity';
import { CreateProgramaDiagnosticoDto } from './Dto/create-programa-diagnostico.dto';
import { UpdateProgramaDiagnosticoDto } from './Dto/update-programa-diagnostico.dto';
import { FinalizarProgramaDto } from './Dto/finalizar-pograma-diagnostico.dto';
import { ResponseProgramaDiagnosticoDto } from './Dto/response-programa-diagnostico.dto';
import { ProgramaDiagnosticoMapper } from './mapper/programa-diagnostico.mapper';
import { Estado } from 'src/enums/Estado';
import { MotivoFin } from 'src/enums/MotivoFin';

@Injectable()
export class ProgramaDiagnosticoService {
  constructor(
    @InjectRepository(ProgramaDiagnostico)
    private programaRepository: Repository<ProgramaDiagnostico>,
    @InjectRepository(HistorialMedico)
    private historialRepository: Repository<HistorialMedico>, // Para validar FK

  ) {}

  // --- 1. Generación de ID (Similar a PacienteService) ---

  private async generateNextProgramaId(): Promise<string> {
    const lastPrograma = await this.programaRepository
      .createQueryBuilder('programa_diagnostico')
      .orderBy('programa_diagnostico.id_programa_diagnostico', 'DESC')
      .getOne();

    let nextIdNumber = 1;
    if (lastPrograma?.id_programa_diagnostico) {
      const numericPart = lastPrograma.id_programa_diagnostico.substring(2);
      if (!isNaN(parseInt(numericPart))) {
        nextIdNumber = parseInt(numericPart) + 1;
      }
    }
    return `PD${nextIdNumber.toString().padStart(5, '0')}`;
  }

  // --- 2. Registrar Programa (POST) ---

  async registrarPrograma(
    createDto: CreateProgramaDiagnosticoDto,
  ): Promise<ResponseProgramaDiagnosticoDto> {
    // 1. Verificar si el historial existe
    const historial = await this.historialRepository.findOne({
      where: { id_historialmedico: createDto.id_historialmedico_historial },
      relations: ['paciente'],
    });

    if (!historial || !historial.paciente) {
      throw new NotFoundException(
        `Historial Médico con ID ${createDto.id_historialmedico_historial} no encontrado`,
      );
    }

    // 2. Generar ID y crear la entidad
    const idPrograma = await this.generateNextProgramaId();

    const nuevoPrograma = this.programaRepository.create({
      // Las propiedades que usan el tipo de la entidad deben manejar la conversión de Date
      id_programa_diagnostico: idPrograma,
      id_historialmedico_historial: historial.id_historialmedico,
      numero_gestacion: createDto.numero_gestacion,

      // Conversión explícita a Date o null
      fecha_probableparto: createDto.fecha_probableparto
        ? new Date(createDto.fecha_probableparto)
        : null, // Si es undefined o null, asignar null

      factor_riesgo: createDto.factor_riesgo,
      observacion: createDto.observacion,

      fecha_inicio: new Date(),
      estado: Estado.ACTIVO,
      // Los campos de finalización son NULL por defecto
      motivo_finalizacion: null, // Asignar null explícitamente ayuda al tipado
      motivo_otros: null, // Asignar null explícitamente ayuda al tipado
    });

    try {
      const programaGuardado =
        await this.programaRepository.save(nuevoPrograma);

      // Asignar relaciones para el mapper de respuesta
programaGuardado.id_historialmedico_historial = historial.id_historialmedico;

      return ProgramaDiagnosticoMapper.toResponseDto(programaGuardado);
    } catch (error) {
      console.error('❌ Error al registrar programa:', error);
      throw new InternalServerErrorException(
        'Error al guardar el Programa Diagnóstico.',
      );
    }
  }

  // --- 3. Buscar Programas por Paciente/DNI (GET) ---

  /**
   * Busca programas diagnósticos haciendo JOINs para acceder a los datos de Paciente.
   * Carga Paciente para que el Mapper pueda extraer nombre/DNI.
   */
  async buscarProgramas(
    query: string,
    searchBy: 'dni' | 'nombre',
  ): Promise<ResponseProgramaDiagnosticoDto[]> {
    if (!query) return [];

    const qb = this.programaRepository
      .createQueryBuilder('pd')
      .innerJoinAndSelect('pd.historialMedico', 'hm')
      .innerJoinAndSelect('hm.paciente', 'p') // Necesario para filtrar y mapear
      .orderBy('pd.fecha_inicio', 'DESC');

    if (searchBy === 'dni') {
      qb.where('p.dni = :query', { query });
    } else if (searchBy === 'nombre') {
      // Busca en nombre y apellido (ejemplo simple)
      qb.where(
        'LOWER(p.nombre) LIKE LOWER(:query) OR LOWER(p.apellido) LIKE LOWER(:query)',
        {
          query: `%${query}%`,
        },
      );
    }

    const programas = await qb.getMany();

    if (programas.length === 0) {
      throw new NotFoundException(
        `No se encontraron programas para la búsqueda: ${query}`,
      );
    }

    return ProgramaDiagnosticoMapper.toResponseDtoList(programas);
  }

  async create(createDto: CreateProgramaDiagnosticoDto): Promise<ProgramaDiagnostico> {
    
    // 💡 Generate the required 7-character primary key here!
    const newId = this.generateCustomId(); // Implement this function to generate 'PD00001'
    
    const nuevoPrograma = this.programaRepository.create({
        ...createDto,
        id_programa_diagnostico: newId, // Assign the manually generated ID
    });

    return this.programaRepository.save(nuevoPrograma);
  }

  // Example generator (needs refinement for production)
  private generateCustomId(): string {
      // Logic to generate a unique 7-character ID (e.g., based on sequential number or unique hash)
      // For testing, a simple placeholder:
      return 'PD' + Math.random().toString(36).substring(2, 7).toUpperCase(); 
  }

  // --- 4. Finalizar Programa (PATCH /:id/finalizar) ---

  async finalizarPrograma(
    id: string,
    finalizarDto: FinalizarProgramaDto,
  ): Promise<ResponseProgramaDiagnosticoDto> {
    const programa = await this.programaRepository.findOne({
      where: { id_programa_diagnostico: id },
      relations: ['historialMedico', 'historialMedico.paciente'],
    });

    if (!programa) {
      throw new NotFoundException(`Programa con ID ${id} no encontrado`);
    }
    if (programa.estado === Estado.FINALIZADO) {
      throw new ConflictException('El programa ya está finalizado.');
    }

    // Validación de 'OTROS'
    if (
      finalizarDto.motivo_finalizacion === MotivoFin.OTROS &&
      !finalizarDto.motivo_otros
    ) {
      throw new BadRequestException(
        'Debe especificar el motivo en el campo "Otros" si selecciona OTROS.',
      );
    }

    // Aplicar cambios
    programa.estado = Estado.FINALIZADO;
    programa.fecha_finalizacion = new Date();
    programa.motivo_finalizacion = finalizarDto.motivo_finalizacion;

    programa.motivo_otros =
      finalizarDto.motivo_finalizacion === MotivoFin.OTROS
        ? (finalizarDto.motivo_otros ?? null)
        : null;

    try {
      const programaFinalizado = await this.programaRepository.save(programa);
      return ProgramaDiagnosticoMapper.toResponseDto(programaFinalizado);
    } catch (error) {
      throw new InternalServerErrorException('Error al finalizar el programa.');
    }
  }

  // --- 5. Activar Programa (PATCH /:id/activar) ---

  async activarPrograma(id: string): Promise<ResponseProgramaDiagnosticoDto> {
    const programa = await this.programaRepository.findOne({
      where: { id_programa_diagnostico: id },
      relations: ['historialMedico', 'historialMedico.paciente'],
    });

    if (!programa) {
      throw new NotFoundException(`Programa con ID ${id} no encontrado`);
    }
    if (programa.estado === Estado.ACTIVO) {
      throw new ConflictException('El programa ya está activo.');
    }

    // Reiniciar campos de finalización
    programa.estado = Estado.ACTIVO;
    programa.fecha_finalizacion = null;
    programa.motivo_finalizacion = null;
    programa.motivo_otros = null;

    try {
      const programaActivado = await this.programaRepository.save(programa);
      return ProgramaDiagnosticoMapper.toResponseDto(programaActivado);
    } catch (error) {
      throw new InternalServerErrorException('Error al activar el programa.');
    }
  }

  // --- 6. Actualizar Información (PUT) ---

  async modificarPrograma(
    id: string,
    updateDto: UpdateProgramaDiagnosticoDto,
  ): Promise<ResponseProgramaDiagnosticoDto> {
    const programa = await this.programaRepository.findOne({
      where: { id_programa_diagnostico: id },
      relations: ['historialMedico', 'historialMedico.paciente'],
    });

    if (!programa) {
      throw new NotFoundException(`Programa con ID ${id} no encontrado`);
    }

    if (updateDto.numero_gestacion !== undefined)
      programa.numero_gestacion = updateDto.numero_gestacion;
    if (updateDto.fecha_probableparto)
      programa.fecha_probableparto = new Date(updateDto.fecha_probableparto);
    if (updateDto.factor_riesgo !== undefined)
      programa.factor_riesgo = updateDto.factor_riesgo;
    if (updateDto.observacion !== undefined)
      programa.observacion = updateDto.observacion;

    try {
      const programaActualizado = await this.programaRepository.save(programa);
      return ProgramaDiagnosticoMapper.toResponseDto(programaActualizado);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al modificar el Programa Diagnóstico',
      );
    }
  }
}
