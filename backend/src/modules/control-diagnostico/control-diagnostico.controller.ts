// src/modules/control-diagnostico/control-diagnostico.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Req, // Para obtener la información del usuario logueado (JWT)
  HttpStatus,
  HttpCode,
  UseGuards, // Usar si tienes guards de autenticación (JWT)
} from '@nestjs/common';
import { ControlDiagnosticoService } from './control-diagnostico.service';
import { CreateControlDiagnosticoDto } from './Dto/create-control-diagnostico.dto';
import { UpdateControlDiagnosticoDto } from './Dto/update-control-diagnostico.dt';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // Ejemplo

@Controller('programas-diagnostico')
// @UseGuards(JwtAuthGuard) // Proteger todos los endpoints
export class ControlDiagnosticoController {
  constructor(
    private readonly controlDiagnosticoService: ControlDiagnosticoService,
  ) {}

  // POST /programas-diagnostico/:id_programa/controles
  @Post(':id_programa/controles')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id_programa') id_programa: string,
    @Body() createDto: CreateControlDiagnosticoDto,
    @Req() req: any, // Aquí se asume que el objeto `req` contiene la información del usuario (id)
  ) {
    // *** Lógica para obtener el ID del usuario logueado (Obstetra) ***
    // Ejemplo: Si usas JWT y NestJS Passport, el ID estaría en req.user.id
    // const id_usuario = req.user.id_usuario; 
    // Usamos un placeholder por ahora:
    const id_usuario = 'OB0001'; 
    // *******************************************************************
    
    const nuevoControl = await this.controlDiagnosticoService.create(
      id_programa,
      id_usuario,
      createDto,
    );
    return {
      message: 'Control diagnóstico registrado exitosamente',
      data: nuevoControl,
    };
  }

  // GET /programas-diagnostico/:id_programa/controles
  @Get(':id_programa/controles')
  async findAllByPrograma(@Param('id_programa') id_programa: string) {
    return this.controlDiagnosticoService.findAllByPrograma(id_programa);
  }

  // GET /programas-diagnostico/:id_programa/controles/:id_control
  @Get(':id_programa/controles/:id_control')
  async findOne(@Param('id_control') id_control: string) {
    return this.controlDiagnosticoService.findOne(id_control);
  }

  // PUT /programas-diagnostico/:id_programa/controles/:id_control
  @Put(':id_programa/controles/:id_control')
  async update(
    @Param('id_control') id_control: string,
    @Body() updateDto: UpdateControlDiagnosticoDto,
  ) {
    const programaActualizado = await this.controlDiagnosticoService.update(
      id_control,
      updateDto,
    );
    return {
      message: 'Control diagnóstico actualizado exitosamente',
      data: programaActualizado,
    };
  }
}