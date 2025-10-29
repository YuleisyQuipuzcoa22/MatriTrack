import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlPuerperio } from './model/control_puerperio.entity';
import { ControlPuerperioController } from './control-puerperio.controller';
import { ControlPuerperioService } from './control-puerperio.service';
import { ProgramaPuerperio } from '../programa-puerperio/model/programa_puerperio.entity';
import { Usuario } from '../usuario/model/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ControlPuerperio, ProgramaPuerperio, Usuario])],
  controllers: [ControlPuerperioController],
  providers: [ControlPuerperioService],
  exports: [ControlPuerperioService],
})
export class ControlPuerperioModule {}
