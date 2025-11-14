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

@Entity('resultado_analisis')
export class ResultadoAnalisis {
  @PrimaryColumn({ type: 'char', length: 7 })
  id_resultado_analisis!: string;


  @Column({ type: 'char', length: 7, nullable: true })
  id_control_diagnostico: string | null = null;

  @ManyToOne(() => ControlDiagnostico, (control) => control.resultadoAnalisis)
  @JoinColumn({ name: 'id_control_diagnostico' })
  controlMedicoDiagnostico?: ControlDiagnostico;

  @Column({ type: 'char', length: 7, nullable: true })
  id_control_puerperio: string | null = null;

  @ManyToOne(() => ControlPuerperio, (control) => control.resultadosAnalisis)
  @JoinColumn({ name: 'id_control_puerperio' })
  controlMedicoPuerperio?: ControlPuerperio;

  @Column({ type: 'char', length: 6, nullable: false })
  id_analisis!: string;
  @ManyToOne(() => Analisis)
  @JoinColumn({ name: 'id_analisis' })
  analisis!: Analisis;

  @CreateDateColumn({ type: 'datetime' })
  fecha_registro!: Date;

  @Column({ type: 'date', nullable: false })
  fecha_realizacion!: Date;

  @Column({ type: 'varchar', length: 150, nullable: false })
  laboratorio!: string;

  @Column({ type: 'varchar', length: 1000, nullable: false })
  resultado!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  observacion: string | null = null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ruta_pdf: string | null = null;

}
