import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';

import { ProgramaDiagnosticoService } from './programa-diagnostico.service';
import { CreateProgramaDiagnosticoDto } from './Dto/create-programa.diagnostico.dto';
import { UpdateProgramaDiagnosticoDto } from './Dto/update-programa-diagnostico.dto';
import { FinalizarProgramaDiagnosticoDto } from './Dto/finalizar-programa-diagnostico.dto';
import { Estado } from 'src/enums/Estado';


@Controller('programas-diagnostico')
export class ProgramaDiagnosticoController {
  constructor(
    private readonly programaDiagnosticoService: ProgramaDiagnosticoService,
  ) {}

  @Post('historial/:id_historialmedico')
  async create(
    @Param('id_historialmedico') id_historialmedico: string,
    @Body() createDto: CreateProgramaDiagnosticoDto,
  ) {
    const nuevoPrograma = await this.programaDiagnosticoService.create(
      id_historialmedico,
      createDto
    );
    return {
      message: 'Programa diagnóstico creado exitosamente',
      data: nuevoPrograma,
    };
  }

  @Get()
  async findAll(
    @Query('dni') dni?: string,
    @Query('nombre') nombre?: string,
    @Query('estado') estado?: Estado,
  ) {
    return this.programaDiagnosticoService.findAll(dni, nombre, estado);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.programaDiagnosticoService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProgramaDiagnosticoDto,
  ) {
    const programaActualizado = await this.programaDiagnosticoService.update(id, updateDto);
    return {
      message: 'Programa diagnóstico actualizado exitosamente',
      data: programaActualizado,
    };
  }

  @Put(':id/finalizar')
  @HttpCode(HttpStatus.OK)
  async finalizar(
    @Param('id') id: string,
    @Body() finalizarDto: FinalizarProgramaDiagnosticoDto,
  ) {
    const programaFinalizado = await this.programaDiagnosticoService.finalizar(id, finalizarDto);
    return {
      message: 'Programa diagnóstico finalizado exitosamente',
      data: programaFinalizado,
    };
  }

  @Put(':id/activar')
  @HttpCode(HttpStatus.OK)
  async activar(@Param('id') id: string) {
    const programaActivado = await this.programaDiagnosticoService.activar(id);
    return {
      message: 'Programa diagnóstico activado exitosamente',
      data: programaActivado,
    };
  }
}