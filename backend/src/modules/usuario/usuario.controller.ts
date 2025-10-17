// src/modules/usuario/usuario.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolUsuario } from 'src/enums/RolUsuario';

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
      data: {
        token: result.token,
        rol: result.rol,
        nombre: result.nombre,
        apellido: result.apellido,
      },
    };
  }

  // REGISTRAR USUARIO (Solo admin)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async registrar(@Body() createUsuarioDto: CreateUsuarioDto) {
    const nuevoUsuario = await this.usuarioService.registrarUsuario(createUsuarioDto);
    return {
      message: 'Usuario registrado exitosamente',
      data: {
        id_usuario: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        rol: nuevoUsuario.rol,
      },
    };
  }

  // LISTAR PERSONAL
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async listarPersonal() {
    const usuarios = await this.usuarioService.listarPersonal();
    return {
      message: 'Personal obtenido exitosamente',
      data: usuarios,
      total: usuarios.length,
    };
  }

  // OBTENER USUARIO POR ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async obtenerPorId(@Param('id') id: string) {
    const usuario = await this.usuarioService.obtenerUsuarioPorId(id);
    return {
      message: 'Usuario obtenido exitosamente',
      data: usuario,
    };
  }

  // MODIFICAR USUARIO
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async modificar(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const usuarioActualizado = await this.usuarioService.modificarUsuario(id, updateUsuarioDto);
    return {
      message: 'Usuario actualizado correctamente',
      data: usuarioActualizado,
    };
  }

  // INHABILITAR USUARIO
  @Put(':id/inhabilitar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async inhabilitar(@Param('id') id: string) {
    const usuarioActualizado = await this.usuarioService.inhabilitarUsuario(id);
    return {
      message: 'Usuario inhabilitado correctamente',
      data: usuarioActualizado,
    };
  }
}