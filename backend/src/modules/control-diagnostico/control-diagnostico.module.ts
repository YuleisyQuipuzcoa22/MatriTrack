// src/modules/control-diagnostico/control-diagnostico.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 1. Entidades necesarias para este módulo
import { ControlDiagnostico } from './model/control_diagnostico.entity';
import { ProgramaDiagnostico } from '../programa-diagnostico/model/programa_diagnostico.entity';

// 2. Componentes del módulo
import { ControlDiagnosticoController } from './control-diagnostico.controller';
import { ControlDiagnosticoService } from './control-diagnostico.service';

@Module({
  imports: [
    // Registra los repositorios de TypeORM que el Service necesita inyectar
    TypeOrmModule.forFeature([
      ControlDiagnostico, 
      ProgramaDiagnostico // Necesario para la validación del estado en el Service
    ]),
  ],
  controllers: [ControlDiagnosticoController],
  providers: [ControlDiagnosticoService],
  exports: [ControlDiagnosticoService], // Exporta el Service si otros módulos lo necesitan (ej. ResultadoAnalisis)
})
export class ControlDiagnosticoModule {}