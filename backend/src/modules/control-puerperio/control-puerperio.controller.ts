import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Delete } from '@nestjs/common';
import { ControlPuerperioService } from './control-puerperio.service';
import { CreateControlPuerperioDto } from './dto/create-control-puerperio.dto';

@Controller('controles-puerperio')
export class ControlPuerperioController {
  constructor(private readonly service: ControlPuerperioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CreateControlPuerperioDto) {
    const creado = await this.service.crearControl(dto);
    return { message: 'Control puerperio creado', data: creado };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listar() {
    const data = await this.service.listarControles();
    return { message: 'Controles obtenidos', data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async obtener(@Param('id') id: string) {
    const c = await this.service.obtenerPorId(id);
    return { message: 'Control obtenido', data: c };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async actualizar(@Param('id') id: string, @Body() changes: any) {
    const updated = await this.service.actualizarControl(id, changes);
    return { message: 'Control actualizado', data: updated };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async eliminar(@Param('id') id: string) {
    await this.service.eliminarControl(id);
    return { message: 'Control eliminado' };
  }
}
