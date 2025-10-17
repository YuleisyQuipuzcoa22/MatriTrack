import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { Paciente } from './model/paciente.entity';
import { HistorialMedico } from '../historial-medico/model/historial_medico.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente, HistorialMedico]),
  ],
  controllers: [PacienteController],
  providers: [PacienteService], 
  exports: [PacienteService],
})
export class PacienteModule {}