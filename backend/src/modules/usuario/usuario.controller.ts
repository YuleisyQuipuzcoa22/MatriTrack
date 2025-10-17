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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

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
      nombre: result.nombre,
      apellido: result.apellido,
    };
  }

  // REGISTRAR USUARIO (Solo admin)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async registrar(@Body() createUsuarioDto: CreateUsuarioDto) {
    const nuevoUsuario =
      await this.usuarioService.registrarUsuario(createUsuarioDto);
    return {
      message: 'Usuario registrado exitosamente',
      id_usuario: nuevoUsuario.id_usuario,
      nombre: nuevoUsuario.nombre,
      rol: nuevoUsuario.rol,
    };
  }

  // LISTAR PERSONAL
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async listarPersonal() {
    return this.usuarioService.listarPersonal();
  }

  // OBTENER USUARIO POR ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async obtenerPorId(@Param('id') id: string) {
    return this.usuarioService.obtenerUsuarioPorId(id);
  }

  // MODIFICAR USUARIO
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async modificar(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @CurrentUser() user: any, // Ejemplo de cómo obtener el usuario autenticado actual
  ) {
    console.log('Usuario que modifica:', user); // Para debug
    await this.usuarioService.modificarUsuario(id, updateUsuarioDto);
    return {
      message: `Usuario ${id} actualizado correctamente`,
    };
  }

  // INHABILITAR USUARIO
  @Put(':id/inhabilitar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  async inhabilitar(@Param('id') id: string) {
    const usuarioActualizado = await this.usuarioService.inhabilitarUsuario(id);
    return {
      message: `Usuario ${id} inhabilitado correctamente`,
      estado: usuarioActualizado.estado,
    };
  }
}
