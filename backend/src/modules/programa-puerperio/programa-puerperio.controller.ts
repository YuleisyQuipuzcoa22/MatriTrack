// src/modules/programa-puerperio/programa-puerperio.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProgramaPuerperioService } from './programa-puerperio.service';
import { CreateProgramaPuerperioDto } from './dto/create-programa-puerperio.dto';
import { QueryProgramaPuerperioDto } from './dto/QueryProgramaPuerperio.dto';
import { UpdateProgramaPuerperioDto } from './dto/update-programa-puerperio.dto';
import { FinalizarProgramaPuerperioDto } from './dto/finalizar-programa-puerperio.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolUsuario } from 'src/enums/RolUsuario';

@Controller('programas-puerperio')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMINISTRADOR, RolUsuario.OBSTETRA)
export class ProgramaPuerperioController {
  constructor(private readonly service: ProgramaPuerperioService) {}

  // ===================================================================
  // CORRECCIÓN: Esta ruta ahora permite a ambos roles crear
  // ===================================================================
  @Post('historial/:id_historialmedico')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.OBSTETRA) // <-- CORREGIDO
  @HttpCode(HttpStatus.CREATED)
  async crear(
    @Param('id_historialmedico') id_historialmedico: string,
    @Body() dto: CreateProgramaPuerperioDto,
  ) {
    const creado = await this.service.create(id_historialmedico, dto);
    return { message: 'Programa puerperio creado', data: creado };
  }
  // ===================================================================

  @Get()
  @HttpCode(HttpStatus.OK)
  async listar(@Query() queryDto: QueryProgramaPuerperioDto) {
    const result = await this.service.findAll(queryDto);
    return {
      message: 'Programas obtenidos',
      ...result, // data y meta
    };
  }

  @Get('disponibles/pacientes')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.OBSTETRA)
  @HttpCode(HttpStatus.OK)
  async getPacientesDisponibles(@Query('busqueda') busqueda?: string) {
    const pacientes = await this.service.getPacientesParaPuerperio(busqueda);
    return {
      message: 'Pacientes disponibles para puerperio obtenidos',
      data: pacientes,
      total: pacientes.length,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async obtener(@Param('id') id: string) {
    const prog = await this.service.findOne(id);
    return { message: 'Programa obtenido', data: prog };
  }

  @Put(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.OBSTETRA)
  @HttpCode(HttpStatus.OK)
  async actualizar(
    @Param('id') id: string,
    @Body() dto: UpdateProgramaPuerperioDto,
  ) {
    const updated = await this.service.update(id, dto);
    return { message: 'Programa actualizado', data: updated };
  }

  @Patch(':id/finalizar')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.OBSTETRA)
  @HttpCode(HttpStatus.OK)
  async finalizar(
    @Param('id') id: string,
    @Body() dto: FinalizarProgramaPuerperioDto,
  ) {
    const finalizado = await this.service.finalizar(id, dto);
    return { message: 'Programa finalizado', data: finalizado };
  }

  @Patch(':id/activar')
  @Roles(RolUsuario.ADMINISTRADOR) // Solo Admin puede reactivar
  @HttpCode(HttpStatus.OK)
  async activar(@Param('id') id: string) {
    const activado = await this.service.activar(id);
    return { message: 'Programa activado', data: activado };
  }
}
