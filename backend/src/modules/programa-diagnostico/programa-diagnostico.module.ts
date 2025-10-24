// src/modules/programa-diagnostico/programa-diagnostico.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramaDiagnostico } from './model/programa_diagnostico.entity';
import { HistorialMedico } from '../historial-medico/model/historial_medico.entity';
import { ProgramaDiagnosticoController } from './programa-diagnostico.controller';
import { ProgramaDiagnosticoService } from './programa-diagnostico.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgramaDiagnostico, HistorialMedico]),
  ],
  controllers: [ProgramaDiagnosticoController],
  providers: [ProgramaDiagnosticoService],
  exports: [ProgramaDiagnosticoService],
})
export class ProgramaDiagnosticoModule {}