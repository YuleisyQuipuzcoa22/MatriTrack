// src/modules/resultado-analisis/resultado-analisis.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultadoAnalisis } from './model/resultado-analisis.entity';
import { ResultadoAnalisisController } from './resultado-analisis.controller';
import { ResultadoAnalisisService } from './service/resultado-analisis.service';
import { ControlDiagnostico } from '../control-diagnostico/model/control_diagnostico.entity';
import { ControlPuerperio } from '../control-puerperio/model/control_puerperio.entity';
import { Analisis } from '../analisis/model/analisis.entity';
import { MulterModule } from '@nestjs/platform-express'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResultadoAnalisis,
      ControlDiagnostico,
      ControlPuerperio, 
      Analisis,
    ]),

    MulterModule.register({
      dest: './uploads', 
    }),
  ],
  controllers: [ResultadoAnalisisController],
  providers: [ResultadoAnalisisService],
  exports: [ResultadoAnalisisService],
})
export class ResultadoAnalisisModule {}