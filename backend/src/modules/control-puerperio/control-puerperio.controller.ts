// src/modules/control-puerperio/control-puerperio.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  Query, // Importado en el paso anterior
} from '@nestjs/common';
import { ControlPuerperioService } from './control-puerperio.service';
import { CreateControlPuerperioDto } from './dto/create-control-puerperio.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolUsuario } from 'src/enums/RolUsuario';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateControlPuerperioDto } from './dto/update-control-puerperio.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { QueryControlPuerperioDto } from './dto/query-control-puerperio.dto'; // Importado en el paso anterior

// La ruta base ahora es 'programas-puerperio' para anidar los controles
@Controller('programas-puerperio')
// ****** ESTA ES LA LÍNEA QUE FALTABA ******
@UseGuards(JwtAuthGuard, RolesGuard) // <-- DESCOMENTAR ESTA LÍNEA
@Roles(RolUsuario.ADMINISTRADOR, RolUsuario.OBSTETRA) // Roles base
export class ControlPuerperioController {
  constructor(private readonly service: ControlPuerperioService) {}

  @Post(':id_programa/controles')
  // --- CORREGIDO: Ahora ambos roles pueden crear ---
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.OBSTETRA) 
  @HttpCode(HttpStatus.CREATED)
  async crear(
    @Param('id_programa') id_programa: string,
    @Body() dto: CreateControlPuerperioDto,
    @CurrentUser() user: { id_usuario: string; rol: string }, // Usar el decorador @CurrentUser
  ) {
    // Obtenemos el ID del usuario logueado (Obstetra) desde el token
    const id_usuario = user.id_usuario; // <-- Esta línea ahora funcionará

    const creado = await this.service.create(id_programa, id_usuario, dto);
    return { message: 'Control puerperio creado', data: creado };
  }

  // GET /programas-puerperio/:id_programa/controles
  @Get(':id_programa/controles')
  @HttpCode(HttpStatus.OK)
  async listarPorPrograma(
    @Param('id_programa') id_programa: string,
    @Query() queryDto: QueryControlPuerperioDto, 
  ) {
    const result = await this.service.findAllByPrograma(id_programa, queryDto); 
    return {
      message: `Controles obtenidos para el programa ${id_programa}`,
      ...result, // Devolver { message, data, meta }
    };
  }

  // GET /programas-puerperio/:id_programa/controles/:id_control
  @Get(':id_programa/controles/:id_control')
  @HttpCode(HttpStatus.OK)
  async obtener(
    @Param('id_programa') _id_programa: string, // No se usa, pero es parte de la ruta
    @Param('id_control') id_control: string,
  ) {
    const c = await this.service.findOne(id_control);
    return { message: 'Control obtenido', data: c };
  }

  // PUT /programas-puerperio/:id_programa/controles/:id_control
  @Put(':id_programa/controles/:id_control')
  // --- CORREGIDO: Ahora ambos roles pueden actualizar ---
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.OBSTETRA) 
  @HttpCode(HttpStatus.OK)
  async actualizar(
    @Param('id_programa') _id_programa: string, // No se usa, pero es parte de la ruta
    @Param('id_control') id_control: string,
    @Body() dto: UpdateControlPuerperioDto,
  ) {
    const updated = await this.service.update(id_control, dto);
    return { message: 'Control actualizado', data: updated };
  }
}