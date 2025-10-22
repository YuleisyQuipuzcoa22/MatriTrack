// src/modules/resultado-analisis/entities/resultado-analisis.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Analisis } from 'src/modules/analisis/model/analisis.entity';
import { ControlPuerperio } from 'src/modules/control-puerperio/model/control_puerperio.entity';
import { ControlDiagnostico } from 'src/modules/control-diagnostico/model/control_diagnostico.entity';
import { Exclude } from 'class-transformer';

@Entity('resultado-analisis')
export class ResultadoAnalisis {
  // PK: char(7)
  @PrimaryColumn({ type: 'char', length: 7 })
  id_resultado_analisis!: string;

  // FK para ControlMedicoDiagnostico (puede ser NULL)
  @ManyToOne(() => ControlDiagnostico, (control) => control.resultadoAnalisis)
  @JoinColumn({ name: 'id_control_diagnostico' })
  @Exclude()
  controlMedicoDiagnostico?: ControlDiagnostico;

  @Column({ type: 'char', length: 7, nullable: true })
  id_control_diagnostico: string | null = null;

  // FK para ControlMedicoPuerperio (puede ser NULL)
  @ManyToOne(() => ControlPuerperio, (control) => control.resultadosAnalisis)
  @JoinColumn({ name: 'id_control_puerperio' })
  @Exclude()
  controlMedicoPuerperio?: ControlPuerperio;

  @Column({ type: 'char', length: 7, nullable: true })
  id_control_puerperio: string | null = null;

  // FK para Analisis (obligatorio)
  @ManyToOne(() => Analisis, (analisis) => analisis.resultados)
  @JoinColumn({ name: 'id_analisis' })
  analisis!: Analisis;

  @Column({ type: 'char', length: 6, nullable: false })
  id_analisis!: string;

  // Fechas
  @CreateDateColumn({ type: 'datetime' })
  fecha_registro!: Date;

  @Column({ type: 'date', nullable: false })
  fecha_realizacion!: Date;

  // Datos del análisis
  @Column({ type: 'varchar', length: 150, nullable: false })
  laboratorio!: string;

  @Column({ type: 'varchar', length: 1000, nullable: false })
  resultado!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  observacion: string | null = null;
}
