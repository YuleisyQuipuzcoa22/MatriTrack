import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { HistorialMedicoService } from './historial-medico.service';
import { ResponseHistorialMedicoDto } from './Dto/response-historialMedico.dto';

@Controller('historial-medico')
export class HistorialMedicoController {
  constructor(
    private readonly historialMedicoService: HistorialMedicoService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const historial = await this.historialMedicoService.findAll();
    return {
      message: 'Historial médico obtenido exitosamente',
      data: historial,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    const historial = await this.historialMedicoService.findById(id);
    return {
      message: 'Historial médico obtenido exitosamente',
      data: historial,
    };
  }

  //USAR ESTE PORQUE DA INFO COMPLETA
  @Get('paciente/:id_paciente')
  @HttpCode(HttpStatus.OK)
  async findByPacienteId(@Param('id_paciente') id_paciente: string) {
    const historial =
      await this.historialMedicoService.findByPacienteId(id_paciente);
    return {
      message: 'Historial médico obtenido exitosamente',
      data: historial,
    };
  }
}
