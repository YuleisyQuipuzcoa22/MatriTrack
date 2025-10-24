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
  Query,
} from '@nestjs/common';
import { AnalisisService } from './analisis.service';
import { CreateAnalisisDto } from './dto/create_analisis.dto';
import { QueryAnalisisDto } from './dto/QueryAnalisis.dto';
import { UpdateAnalisisDto } from './dto/update_analisis.dto';

@Controller('analisis')
export class AnalisisController {
  constructor(private readonly analisisService: AnalisisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registrarAnalisis(@Body() createAnalisisDto: CreateAnalisisDto) {
    const analisis =
      await this.analisisService.registrarAnalisis(createAnalisisDto);
    return {
      message: 'Analisis registrado exitosamente',
      data: analisis,
    };
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async listarAnalisis(@Query() queryDto: QueryAnalisisDto) {
    const result = await this.analisisService.listarAnalisis(queryDto);
    return {
      message: 'Analisis obtenidos exitosamente',
      ...result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async obtenerAnalisisPorId(@Param('id') id: string) {
    const analisis = await this.analisisService.obtenerAnalisisPorId(id);
    return {
      message: 'Analisis obtenido con éxito',
      data: analisis,
    };
  }
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async modificarAnalisis(
    @Param('id') id: string,
    @Body() updateAnalisisDto: UpdateAnalisisDto,
  ) {
    const analisis = await this.analisisService.modificarAnalisis(
      id,
      updateAnalisisDto,
    );
    return {
      message: 'Analisis modificado con éxito',
      data: analisis,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async inhabilitarAnalisis(@Param('id') id: string){
    const analisis = await this.analisisService.inhabilitarAnalisis(id);
    return{
      message: 'Análisis inhabilitado con éxito',
      data:analisis,
    }
  }
}
