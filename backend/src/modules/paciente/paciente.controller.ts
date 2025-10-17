import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';

import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PacienteService } from './paciente.service';

@Controller('pacientes')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  //CREAR PACIENTE con historial medico
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registrarPaciente(@Body() createPacienteDto: CreatePacienteDto) {
    const paciente = await this.pacienteService.registrarPaciente(createPacienteDto);
    return {
      message: 'Paciente registrado exitosamente',
      data: paciente,
    };
  }

  //OBTENER TODOS LOS PACIENTES

   @Get()
  @HttpCode(HttpStatus.OK)
  async listarPacientes() {
    const pacientes = await this.pacienteService.listarPacientes();
    return {
      message: 'Pacientes obtenidos exitosamente',
      data: pacientes,
      total: pacientes.length,
    };
  }

  //OBTENER PACIENTE POR ID
   @Get(':id')
  @HttpCode(HttpStatus.OK)
  async obtenerPacientePorId(@Param('id') id: string) {
    const paciente = await this.pacienteService.obtenerPacientePorId(id);
    return {
      message: 'Paciente obtenido exitosamente',
      data: paciente,
    };
  }

  //ACTUALIZAR PACIENTE
   @Put(':id')
  @HttpCode(HttpStatus.OK)
  async modificarPaciente(
    @Param('id') id: string,
    @Body() updatePacienteDto: UpdatePacienteDto,
  ) {
    const paciente = await this.pacienteService.modificarPaciente(id, updatePacienteDto);
    return {
      message: 'Paciente modificado exitosamente',
      data: paciente,
    };
  }

  //INHABILITAR PACIENTE
  @Patch(':id/inhabilitar')
  @HttpCode(HttpStatus.OK)
  async inhabilitarPaciente(@Param('id') id: string) {
    const paciente = await this.pacienteService.inhabilitarPaciente(id);
    return {
      message: 'Paciente inhabilitado exitosamente',
      data: paciente,
    };
  }
}
