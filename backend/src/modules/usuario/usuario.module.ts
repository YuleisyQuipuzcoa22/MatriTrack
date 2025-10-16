// src/modules/usuario/usuario.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { Usuario } from './model/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario
  ])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService], // Para usar en otros módulos (Auth)
})
export class UsuarioModule {}