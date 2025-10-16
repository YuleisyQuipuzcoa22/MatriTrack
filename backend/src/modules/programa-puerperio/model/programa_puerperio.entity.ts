import { Estado } from "src/enums/Estado";
import { TipoParto } from "src/enums/TipoParto";
import { HistorialMedico } from "src/modules/historial-medico/model/historial_medico.entity";
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("programa_puerperio")
export class ProgramaPuerperio {
  // PK: char(7). Se usa '!' porque el valor se genera en el Controller.
  @PrimaryColumn({ type: "char", length: 7 })
  id_programapuerperio!: string;

  // Relación Many-to-One con HistorialMedico
  // Un historial médico puede tener muchos programas de puerperio
  @ManyToOne(() => HistorialMedico)
  @JoinColumn({ name: "id_historialmedico" })
  historialMedico!: HistorialMedico;

  // FK explícita
  @Column({ type: "char", length: 6, nullable: false })
  id_historialmedico!: string;

  // Columnas normales
  @CreateDateColumn({ type: "datetime" })
  fecha_inicio!: Date;

  @Column({ type: "enum", enum: TipoParto, nullable: false })
  tipo_parto!: TipoParto;

  @Column({ type: "varchar", length: 1000, nullable: true })
  observacion: string | null = null;

  @Column({ type: "varchar", length: 500, nullable: true })
  complicacion: string | null = null;

  @Column({
    type: "enum",
    enum: Estado,
    nullable: false,
    default: Estado.ACTIVO,
  })
  estado!: Estado;

  @Column({ type: "date", nullable: true })
  fecha_finalizacion: Date | null = null;

  @Column({ type: "varchar", length: 500, nullable: true })
  motivo_finalizacion: string | null = null;
}
