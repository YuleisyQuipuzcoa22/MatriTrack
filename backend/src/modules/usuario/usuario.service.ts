// src/modules/usuario/usuario.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { RolUsuario } from '../../enums/RolUsuario';
import { Estado } from '../../enums/Estado';
import { Usuario } from './model/usuario.entity';

@Injectable()
export class UsuarioService {
  private readonly JWT_SECRET: string;
  private readonly RECAPTCHA_SECRET: string;

  constructor(
    @InjectRepository(Usuario) //acceso a la base de datos con metodos CRUD
    private usuarioRepository: Repository<Usuario>,
    private configService: ConfigService, //leer variables de entorno
  ) {
    this.JWT_SECRET =
      this.configService.get<string>('JWT_SECRET') || 'tu_clave_secreta_fuerte';
    this.RECAPTCHA_SECRET =
      this.configService.get<string>('RECAPTCHA_SECRET_KEY') ||
      'CLAVE_RECAPTCHA_DEFAULT_TEMPORAL';
  }

  //  GENERAR ID AUTOMÁTICO
  private async generateNextUserId(): Promise<string> {
    const lastUser = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .orderBy('id_usuario', 'DESC')
      .getOne();

    let nextIdNumber = 1;
    if (
      lastUser &&
      lastUser.id_usuario &&
      !isNaN(parseInt(lastUser.id_usuario.substring(2)))
    ) {
      nextIdNumber = parseInt(lastUser.id_usuario.substring(2)) + 1;
    }
    return `OB${nextIdNumber.toString().padStart(4, '0')}`;
  }

  //REGISTRAR USUARIO
  async registrarUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const nuevoUsuario = new Usuario();
      //copiar datos del dto al nuevo usuario
      Object.assign(nuevoUsuario, createUsuarioDto);
      nuevoUsuario.fecha_nacimiento = new Date(
        createUsuarioDto.fecha_nacimiento,
      );
      nuevoUsuario.id_usuario = await this.generateNextUserId();

      return await this.usuarioRepository.save(nuevoUsuario);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'El DNI, Correo Electrónico o N° de Colegiatura ya están registrados.',
        );
      }
      throw error;
    }
  }

  // OBTENER USUARIO POR ID
  async obtenerUsuarioPorId(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      select: [
        'id_usuario',
        'dni',
        'nombre',
        'apellido',
        'rol',
        'fecha_nacimiento',
        'correo_electronico',
        'telefono',
        'numero_colegiatura',
        'estado',
        'direccion',
      ],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  //LISTAR PERSONAL (OBSTETRAS Y ADMINS)
  async listarPersonal(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      where: [{ rol: RolUsuario.OBSTETRA }, { rol: RolUsuario.ADMINISTRADOR }],
      select: [
        'id_usuario',
        'dni',
        'nombre',
        'apellido',
        'correo_electronico',
        'telefono',
        'numero_colegiatura',
        'fecha_nacimiento',
        'estado',
        'rol',
        'direccion',
      ],
    });
  }

  //MODIFICAR USUARIO
  async modificarUsuario(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuarioAeditar = await this.usuarioRepository.findOneBy({
      id_usuario: id,
    });

    if (!usuarioAeditar) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Aplicar solo campos permitidos
    if (updateUsuarioDto.nombre)
      usuarioAeditar.nombre = updateUsuarioDto.nombre;
    if (updateUsuarioDto.apellido)
      usuarioAeditar.apellido = updateUsuarioDto.apellido;
    if (updateUsuarioDto.telefono)
      usuarioAeditar.telefono = updateUsuarioDto.telefono;
    if (updateUsuarioDto.direccion !== undefined)
      usuarioAeditar.direccion = updateUsuarioDto.direccion;
    if (updateUsuarioDto.numero_colegiatura)
      usuarioAeditar.numero_colegiatura = updateUsuarioDto.numero_colegiatura;
    if (updateUsuarioDto.fecha_nacimiento)
      usuarioAeditar.fecha_nacimiento = new Date(
        updateUsuarioDto.fecha_nacimiento,
      );
    if (updateUsuarioDto.estado)
      usuarioAeditar.estado = updateUsuarioDto.estado;
    if (updateUsuarioDto.rol) 
      usuarioAeditar.rol = updateUsuarioDto.rol;

    try {
      return await this.usuarioRepository.save(usuarioAeditar);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'El DNI,correo o N° de Colegiatura ya están registrados',
        );
      }
      throw error;
    }
  }

  //INHABILITAR USUARIO
  async inhabilitarUsuario(id_usuario: string): Promise<Usuario> {
    const usuarioAInhabilitar = await this.usuarioRepository.findOneBy({
      id_usuario,
    });

    if (!usuarioAInhabilitar) {
      throw new NotFoundException('Usuario no encontrado');
    }

    usuarioAInhabilitar.estado = Estado.INACTIVO; 
    return await this.usuarioRepository.save(usuarioAInhabilitar);
  }

  // LOGIN
  async login(loginDto: LoginDto) {
    const { dni, contrasena, recaptchaToken } = loginDto;

    // Verificar reCAPTCHA
    if (!this.RECAPTCHA_SECRET) {
      throw new Error('Clave secreta reCAPTCHA no configurada en el servidor');
    }

    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${this.RECAPTCHA_SECRET}&response=${recaptchaToken}`;
    const googleResponse = await axios.post(verificationURL);
    // Definimos el tipo esperado para la respuesta de reCAPTCHA:
    interface RecaptchaResponse {
      success: boolean;
      'error-codes'?: string[]; // La propiedad 'error-codes' es opcional y puede no existir
    }
    // Desestructuramos la data y la tratamos como el tipo definido
    const { success, 'error-codes': errorCodes } =
      googleResponse.data as RecaptchaResponse;
    console.log('Resultado de reCAPTCHA (success):', success); // <--- DEBE SER TRUE

    if (!success) {
      console.error('Error de verificación reCAPTCHA:', errorCodes);
      throw new UnauthorizedException(
        'Verificación reCAPTCHA fallida. Por favor, inténtelo de nuevo',
      );
    }

    // Buscar usuario
    const usuario = await this.usuarioRepository
    //es como hacer un SELECT * FROM usuario WHERE dni = 'dni'
      .createQueryBuilder('usuario')//usuario es un alias
      .addSelect('usuario.contrasena')//seleccionar la contraseña que por defecto no se selecciona
      .where('usuario.dni = :dni', { dni })//filtrar por dni
      .getOne();
    console.log('Usuario encontrado:', usuario ? usuario.dni : 'null');
    if (!usuario || usuario.estado === Estado.INACTIVO) {
      throw new UnauthorizedException(
        'Credenciales inválidas o usuario inactivo',
      );
    }

    // Verificar contraseña (en texto plano por ahora)
    const contrasenaValida = contrasena === usuario.contrasena;
    if (!contrasenaValida) {
      throw new UnauthorizedException(
        'Credenciales inválidas o usuario incorrecto',
      );
    }

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      this.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return {
      token,
      rol: usuario.rol,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
    };
  }
}
