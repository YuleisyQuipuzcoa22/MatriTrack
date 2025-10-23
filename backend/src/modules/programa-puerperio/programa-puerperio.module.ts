import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramaPuerperio } from './model/programa_puerperio.entity';
import { HistorialMedico } from '../historial-medico/model/historial_medico.entity';
import { ProgramaPuerperioController } from './programa-puerperio.controller';
import { ProgramaPuerperioService } from './programa-puerperio.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProgramaPuerperio, HistorialMedico])],
  controllers: [ProgramaPuerperioController],
  providers: [ProgramaPuerperioService],
  exports: [ProgramaPuerperioService],
})
export class ProgramaPuerperioModule {}
