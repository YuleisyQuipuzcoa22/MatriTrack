import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramaDiagnostico } from '../programa-diagnostico/model/programa_diagnostico.entity';
import { HistorialMedico } from './model/historial_medico.entity';
import { ProgramaPuerperio } from '../programa-puerperio/model/programa_puerperio.entity';
import { HistorialMedicoService } from './historial-medico.service';
import { HistorialMedicoController } from './historial-medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialMedico, ProgramaDiagnostico, ProgramaPuerperio])],
  providers: [HistorialMedicoService],
  controllers: [HistorialMedicoController],
})
export class HistorialMedicoModule {}
