// src/modules/resultado-analisis/resultado-analisis.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultadoAnalisis } from './model/resultado-analisis.entity';
import { ResultadoAnalisisController } from './resultado-analisis.controller';
import { ResultadoAnalisisService } from './service/resultado-analisis.service';
import { ControlDiagnostico } from '../control-diagnostico/model/control_diagnostico.entity';
import { ControlPuerperio } from '../control-puerperio/model/control_puerperio.entity';
import { Analisis } from '../analisis/model/analisis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResultadoAnalisis,
      ControlDiagnostico, // Importamos para que el servicio pueda validar
      ControlPuerperio, // Importamos para que el servicio pueda validar
      Analisis, // Importamos para las relaciones
    ]),
  ],
  controllers: [ResultadoAnalisisController],
  providers: [ResultadoAnalisisService],
  exports: [ResultadoAnalisisService],
})
export class ResultadoAnalisisModule {}