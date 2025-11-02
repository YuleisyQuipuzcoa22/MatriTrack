// src/modules/programa-puerperio/model/programa_puerperio.entity.ts
import { Estado } from 'src/enums/Estado';
import { TipoParto } from 'src/enums/TipoParto';
import { ControlPuerperio } from 'src/modules/control-puerperio/model/control_puerperio.entity';
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
import { MotivoFinPuerperio } from 'src/enums/MotivoFinPuerperio'; // Importar el nuevo enum

@Entity('programa_puerperio')
export class ProgramaPuerperio {
  @PrimaryColumn({ type: 'char', length: 7 })
  id_programapuerperio!: string;

  @ManyToOne(() => HistorialMedico, (historial) => historial.programasPuerperio) // Relación inversa añadida en historial
  @JoinColumn({ name: 'id_historialmedico' })
  historialMedico!: HistorialMedico;

  @Column({ type: 'char', length: 6, nullable: false })
  id_historialmedico!: string;

  @CreateDateColumn({ type: 'datetime' })
  fecha_inicio!: Date;

  @Column({ type: 'enum', enum: TipoParto, nullable: false })
  tipo_parto!: TipoParto;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  observacion: string | null = null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  complicacion: string | null = null;

  @Column({
    type: 'enum',
    enum: Estado,
    nullable: false,
    default: Estado.ACTIVO,
  })
  estado!: Estado;

  @Column({ type: 'date', nullable: true })
  fecha_finalizacion: Date | null = null;

  // Actualizado para usar el Enum
  @Column({ type: 'enum', enum: MotivoFinPuerperio, nullable: true })
  motivo_finalizacion: MotivoFinPuerperio | null = null;

  // Añadido para coincidir con el patrón de diagnóstico
  @Column({ type: 'varchar', length: 100, nullable: true })
  motivo_otros: string | null = null;

  @OneToMany(() => ControlPuerperio, (control) => control.programaPuerperio)
  controlesMedicos?: ControlPuerperio[];
}