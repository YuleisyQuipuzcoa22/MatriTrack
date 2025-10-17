import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramaDiagnostico } from '../programa-diagnostico/model/programa_diagnostico.entity';
import { HistorialMedico } from './model/historial_medico.entity';
import { ProgramaPuerperio } from '../programa-puerperio/model/programa_puerperio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialMedico, ProgramaDiagnostico, ProgramaPuerperio])],
})
export class HistorialMedicoModule {}
