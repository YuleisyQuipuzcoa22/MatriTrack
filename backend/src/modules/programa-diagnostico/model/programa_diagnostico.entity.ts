import { Estado } from 'src/enums/Estado';
import { MotivoFin } from 'src/enums/MotivoFin';
import { ControlDiagnostico } from 'src/modules/control-diagnostico/model/control_diagnostico.entity';
import { HistorialMedico } from 'src/modules/historial-medico/model/historial_medico.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('programa_diagnostico')
export class ProgramaDiagnostico {
  // PK: char(7). Se usa '!' porque el valor se genera en el Controller.
  @PrimaryColumn({ type: 'char', length: 7 })
  id_programadiagnostico!: string;

  // Relación Many-to-One con HistorialMedico
  // Un historial médico puede tener muchos programas de diagnóstico
  @ManyToOne(() => HistorialMedico)
  @JoinColumn({ name: 'id_historialmedico' })
  historialMedico!: HistorialMedico;

  // FK explícita
  @Column({ type: 'char', length: 6, nullable: false })
  id_historialmedico!: string;

  // Columnas normales
  @CreateDateColumn({ type: 'datetime' })
  fecha_inicio!: Date;

  @Column({ type: 'integer', nullable: false })
  numero_gestacion!: number;

  @Column({ type: 'date', nullable: true })
  fecha_probableparto!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  factor_riesgo: string | null = null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  observacion: string | null = null;

  @Column({
    type: 'enum',
    enum: Estado,
    nullable: false,
    default: Estado.ACTIVO,
  })
  estado!: Estado;

  @Column({ type: 'date', nullable: true })
  fecha_finalizacion: Date | null = null;

  @Column({ type: 'enum', enum: MotivoFin, nullable: true })
  motivo_finalizacion: MotivoFin | null = null;

  // Solo se llena cuando motivo_finalizacion es OTROS
  @Column({ type: 'varchar', length: 100, nullable: true })
  motivo_otros: string | null = null;

  // Relación inversa, un programa de diagnóstico puede tener muchos controles médicos
@OneToMany(() => ControlDiagnostico, (control) => control.programaDiagnostico)
  controlesMedicos?: ControlDiagnostico[];
}
