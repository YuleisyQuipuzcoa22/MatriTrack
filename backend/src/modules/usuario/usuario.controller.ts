// src/modules/usuario/usuario.controller.ts
import { Controller, Get, Post, Put, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // LOGIN (RUTA PÚBLICA)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.usuarioService.login(loginDto);
    return {
      message: 'Inicio de sesión exitoso',
      token: result.token,
      rol: result.rol,
    };
  }

  // REGISTRAR USUARIO (PROTEGIDA - la protegeremos después)
  @Post()
  async registrar(@Body() createUsuarioDto: CreateUsuarioDto) {
    const nuevoUsuario = await this.usuarioService.registrarUsuario(createUsuarioDto);
    return {
      message: 'Usuario registrado exitosamente',
      id_usuario: nuevoUsuario.id_usuario,
      nombre: nuevoUsuario.nombre,
      rol: nuevoUsuario.rol,
    };
  }

  // LISTAR PERSONAL (PROTEGIDA - la protegeremos después)
  @Get()
  async listarPersonal() {
    return this.usuarioService.listarPersonal();
  }

  // OBTENER USUARIO POR ID (PROTEGIDA - la protegeremos después)
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.usuarioService.obtenerUsuarioPorId(id);
  }

  // MODIFICAR USUARIO (PROTEGIDA - la protegeremos después)
  @Put(':id')
  async modificar(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    await this.usuarioService.modificarUsuario(id, updateUsuarioDto);
    return {
      message: `Usuario ${id} actualizado correctamente`,
    };
  }

  // INHABILITAR USUARIO (PROTEGIDA - la protegeremos después)
  @Put(':id/inhabilitar')
  async inhabilitar(@Param('id') id: string) {
    const usuarioActualizado = await this.usuarioService.inhabilitarUsuario(id);
    return {
      message: `Usuario ${id} inhabilitado correctamente`,
      estado: usuarioActualizado.estado,
    };
  }
}