import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { HistorialMedicoService } from './historial-medico.service';
import { ResponseHistorialMedicoDto } from './Dto/response-historialMedico.dto';
import { UpdateHistorialMedicoDto } from './Dto/updateHistorialMedico.dto';

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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateHistorialMedicoDto: UpdateHistorialMedicoDto,
  ) {
    const historial = await this.historialMedicoService.update(
      id,
      updateHistorialMedicoDto,
    );
    return {
      message: 'Historial médico actualizado exitosamente',
      data: historial,
    };
  }
}
