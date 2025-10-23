import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Delete } from '@nestjs/common';
import { ProgramaPuerperioService } from './programa-puerperio.service';
import { CreateProgramaPuerperioDto } from './dto/create-programa-puerperio.dto';

@Controller('programas-puerperio')
export class ProgramaPuerperioController {
  constructor(private readonly service: ProgramaPuerperioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CreateProgramaPuerperioDto) {
    const creado = await this.service.crearPrograma(dto);
    return { message: 'Programa puerperio creado', data: creado };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listar() {
    const data = await this.service.listarProgramas();
    return { message: 'Programas obtenidos', data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async obtener(@Param('id') id: string) {
    const prog = await this.service.obtenerPorId(id);
    return { message: 'Programa obtenido', data: prog };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async actualizar(@Param('id') id: string, @Body() changes: any) {
    const updated = await this.service.actualizarPrograma(id, changes);
    return { message: 'Programa actualizado', data: updated };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async eliminar(@Param('id') id: string) {
    await this.service.eliminarPrograma(id);
    return { message: 'Programa eliminado' };
  }
}
