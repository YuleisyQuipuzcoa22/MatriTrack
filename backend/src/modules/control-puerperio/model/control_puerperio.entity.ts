// src/modules/control-puerperio/entities/control-puerperio.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { ProgramaPuerperio } from 'src/modules/programa-puerperio/model/programa_puerperio.entity';
import { Usuario } from 'src/modules/usuario/model/usuario.entity';
import { ResultadoAnalisis } from 'src/modules/resultado-analisis/model/resultado-analisis.entity';

@Entity('control_puerperio')
export class ControlPuerperio {
  // PK: char(7)
  @PrimaryColumn({ type: 'char', length: 7 })
  id_control_puerperio!: string;

  // Relación Many-to-One con ProgramaPuerperio
  @ManyToOne(() => ProgramaPuerperio, (programa) => programa.controlesMedicos)
  @JoinColumn({ name: 'id_programapuerperio' })
  programaPuerperio?: ProgramaPuerperio;

  // FK explícita para ProgramaPuerperio
  @Column({ type: 'char', length: 7, nullable: false })
  id_programapuerperio!: string;

  // Relación Many-to-One con Usuario (obstetra que realiza el control)
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario?: Usuario;

  // FK explícita para Usuario
  @Column({ type: 'char', length: 6, nullable: false })
  usuario_id_usuario!: string;

  // Fecha de control (automática)
   @CreateDateColumn({ type: 'datetime', nullable: false })
  fecha_controlpuerperio!: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  fecha_modificacion!: Date;

  // Columnas normales
  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: false })
  peso!: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: false })
  talla!: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  presion_arterial!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  involucion_uterina: string | null = null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cicatrizacion: string | null = null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  estado_mamas_lactancia: string | null = null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  estado_emocional: string | null = null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  observacion: string | null = null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  recomendacion: string | null = null;

  // Relación inversa con ResultadoAnalisis
  @OneToMany(
    () => ResultadoAnalisis,
    (resultado) => resultado.controlMedicoPuerperio,
  )
  resultadosAnalisis?: ResultadoAnalisis[];
}
