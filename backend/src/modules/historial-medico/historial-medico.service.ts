// historial-medico.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialMedico } from './model/historial_medico.entity';
import { ResponseHistorialMedicoDto } from './Dto/response-historialMedico.dto';
import { HistorialMedicoMapper } from './mapper/historialMedico.mapper';

@Injectable()
export class HistorialMedicoService {
  constructor(
    @InjectRepository(HistorialMedico)
    private readonly historialMedicoRepository: Repository<HistorialMedico>,
  ) {}

  async findById(id_historialmedico: string): Promise<ResponseHistorialMedicoDto> {
    const historial = await this.historialMedicoRepository.findOne({
      where: { id_historialmedico },
      relations: ['programasDiagnostico', 'programasPuerperio'],
    });

    if (!historial) {
      throw new NotFoundException(
        `Historial médico con ID ${id_historialmedico} no encontrado`,
      );
    }

    return HistorialMedicoMapper.toResponseDto(historial);
  }

  async findByPacienteId(id_paciente: string): Promise<ResponseHistorialMedicoDto> {
    const historial = await this.historialMedicoRepository.findOne({
      where: { id_paciente },
      relations: ['programasDiagnostico', 'programasPuerperio'],
    });

    if (!historial) {
      throw new NotFoundException(
        `Historial médico del paciente con ID ${id_paciente} no encontrado`,
      );
    }

    return HistorialMedicoMapper.toResponseDto(historial);
  }

  async findAll(): Promise<ResponseHistorialMedicoDto[]> {
    const historiales = await this.historialMedicoRepository.find({
      relations: ['programasDiagnostico', 'programasPuerperio'],
    });

    return historiales.map(historial => 
      HistorialMedicoMapper.toResponseDto(historial)
    );
  }
}