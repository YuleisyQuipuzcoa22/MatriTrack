// src/modules/resultado-analisis/resultado-analisis.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { ResultadoAnalisisService } from './service/resultado-analisis.service';
import { CreateResultadoAnalisisDto } from './dto/create-resultado-analisis.dto';
import { UpdateResultadoAnalisisDto } from './dto/update-resultado-analisis.dto';

@Controller('resultados-analisis')
export class ResultadoAnalisisController {
  constructor(private readonly service: ResultadoAnalisisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CreateResultadoAnalisisDto) {
    const creado = await this.service.crearResultado(dto);
    return { message: 'Resultado de análisis creado', data: creado };
  }

  // Endpoint para listar resultados por control (diagnóstico o puerperio)
  // Ejemplo: /resultados-analisis/control/DGN0001?tipo=diagnostico
  @Get('control/:idControl')
  @HttpCode(HttpStatus.OK)
  async listarPorControl(
    @Param('idControl') idControl: string,
    @Query('tipo', new ParseEnumPipe(['diagnostico', 'puerperio']))
    tipo: 'diagnostico' | 'puerperio',
  ) {
    const data = await this.service.listarPorControl(idControl, tipo);
    return { message: 'Resultados obtenidos', data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async obtener(@Param('id') id: string) {
    const data = await this.service.obtenerPorId(id);
    return { message: 'Resultado obtenido', data };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async actualizar(
    @Param('id') id: string,
    @Body() dto: UpdateResultadoAnalisisDto,
  ) {
    const updated = await this.service.actualizarResultado(id, dto);
    return { message: 'Resultado actualizado', data: updated };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async eliminar(@Param('id') id: string) {
    await this.service.eliminarResultado(id);
    return { message: 'Resultado de análisis eliminado' };
  }
}