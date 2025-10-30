import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';

import { ProgramaDiagnosticoService } from './programa-diagnostico.service';
import { CreateProgramaDiagnosticoDto } from './Dto/create-programa.diagnostico.dto';
import { UpdateProgramaDiagnosticoDto } from './Dto/update-programa-diagnostico.dto';
import { FinalizarProgramaDiagnosticoDto } from './Dto/finalizar-programa-diagnostico.dto';
import { Estado } from 'src/enums/Estado';
import { QueryProgramaDiagnosticoDto } from './Dto/QueryProgramaDiagnostico.dto';

@Controller('programas-diagnostico')
export class ProgramaDiagnosticoController {
  constructor(
    private readonly programaDiagnosticoService: ProgramaDiagnosticoService,
  ) {}

  //crear programa para historial específico
  @Post('historial/:id_historialmedico')
  @HttpCode(HttpStatus.CREATED)
  async crearProgramaDiagnostico(
    @Param('id_historialmedico') id_historialmedico: string,
    @Body() createDto: CreateProgramaDiagnosticoDto,
  ) {
    const nuevoPrograma = await this.programaDiagnosticoService.create(
      id_historialmedico,
      createDto,
    );
    return {
      message: 'Programa diagnóstico creado exitosamente',
      data: nuevoPrograma,
    };
  }

  //Listar todos, con filtros
  @Get()
  @HttpCode(HttpStatus.OK)
  async obtenerTodos(@Query() queryDto: QueryProgramaDiagnosticoDto) {
    const result = await this.programaDiagnosticoService.findAll(queryDto);
    return {
      message: 'Programas obtenidos exitosamente',
      ...result, // data y meta
    };
  }
  // PACIENTES DISPONIBLES (sin programa activo)
  @Get('disponibles/pacientes')
  @HttpCode(HttpStatus.OK)
  async getPacientesDisponibles(@Query('busqueda') busqueda?: string) {
    const pacientes = await this.programaDiagnosticoService.getPacientesDisponibles(busqueda);
    return {
      message: 'Pacientes disponibles obtenidos',
      data: pacientes,
      total: pacientes.length,
    };
  }

  //obtener programa por id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async obtenerPorId(@Param('id') id: string) {
    const programa = await this.programaDiagnosticoService.findOne(id);
    return {
      message: 'Programa obtenido exitosamente',
      data: programa,
    };
  }

  //Actualizar programa
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async actualizarProgramaDiagnostico(
    @Param('id') id: string,
    @Body() updateDto: UpdateProgramaDiagnosticoDto,
  ) {
    const programaActualizado = await this.programaDiagnosticoService.update(
      id,
      updateDto,
    );
    return {
      message: 'Programa diagnóstico actualizado exitosamente',
      data: programaActualizado,
    };
  }

  //finalizar un programa
  @Patch(':id/finalizar')
  @HttpCode(HttpStatus.OK)
  async finalizar(
    @Param('id') id: string,
    @Body() finalizarDto: FinalizarProgramaDiagnosticoDto,
  ) {
    const programaFinalizado = await this.programaDiagnosticoService.finalizar(
      id,
      finalizarDto,
    );
    return {
      message: 'Programa diagnóstico finalizado exitosamente',
      data: programaFinalizado,
    };
  }

  @Patch(':id/activar')
  @HttpCode(HttpStatus.OK)
  async activar(@Param('id') id: string) {
    const programaActivado = await this.programaDiagnosticoService.activar(id);
    return {
      message: 'Programa diagnóstico activado exitosamente',
      data: programaActivado,
    };
  }
}
