import { ProgramaDiagnostico } from 'src/modules/programa-diagnostico/model/programa_diagnostico.entity';
import { ResultadoAnalisis } from 'src/modules/resultado-analisis/model/resultado-analisis.entity';
import { Usuario } from 'src/modules/usuario/model/usuario.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('control_diagnostico')
export class ControlDiagnostico {
  // PK: char(7). Se usa '!' porque el valor se genera en el Controller.
  @PrimaryColumn({ type: 'char', length: 7 })
  id_control_diagnostico!: string;

  // Relación Many-to-One con ProgramaDiagnostico
  // Un programa puede tener muchos controles médicos
  @ManyToOne(() => ProgramaDiagnostico)
  @JoinColumn({ name: 'id_programadiagnostico' })
  programaDiagnostico!: ProgramaDiagnostico;

  // FK explícita para ProgramaDiagnostico
  @Column({ type: 'char', length: 7, nullable: false })
  id_programadiagnostico!: string;

  // Relación Many-to-One con Usuario (el obstetra que realiza el control)
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  // FK explícita para Usuario
  @Column({ type: 'char', length: 6, nullable: false })
  id_usuario!: string;

  // Fecha de control se establece automáticamente al crear
  @CreateDateColumn({ type: 'datetime' })
  fecha_controldiagnostico!: Date;

  // Fecha de modificación se actualiza automáticamente
  @UpdateDateColumn({ type: 'datetime' })
  fecha_modificacion!: Date;

  // Columnas normales
  @Column({ type: 'int', nullable: false })
  semana_gestacion!: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: false })
  peso!: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: false })
  talla!: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  presion_arterial!: string;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: false })
  altura_uterina!: number;

  @Column({ type: 'int', nullable: false })
  fcf!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  observacion: string | null = null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recomendacion: string | null = null;

  @ManyToOne(
    () => ResultadoAnalisis,
    (resultado) => resultado.controlMedicoDiagnostico,
  )
  resultadoAnalisis?: ResultadoAnalisis[];
}
