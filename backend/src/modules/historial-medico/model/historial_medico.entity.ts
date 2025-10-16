import { TipoSangre } from 'src/enums/TipoSangre';
import { Paciente } from 'src/modules/paciente/model/paciente.entity';
import { ProgramaDiagnostico } from 'src/modules/programa-diagnostico/model/programa_diagnostico.entity';
import { ProgramaPuerperio } from 'src/modules/programa-puerperio/model/programa_puerperio.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity('historial_medico')
export class HistorialMedico {
  // PK: char(6). Se usa '!' porque el valor se genera en el Controller.
  @PrimaryColumn({ type: 'char', length: 6 })
  id_historialmedico!: string;

  // Relación One-to-One con Paciente
  // Un historial médico pertenece a un único paciente
  @OneToOne(() => Paciente)
  @JoinColumn({ name: 'id_paciente' })
  paciente!: Paciente;

  // FK explícita (opcional, pero útil para consultas directas)
  @Column({ type: 'char', length: 6, unique: true, nullable: false })
  id_paciente!: string;

  // Columnas normales
  @CreateDateColumn({ type: 'datetime' })
  fecha_iniciohistorial!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  antecedente_medico: string | null = null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  alergia: string | null = null;

  @Column({ type: 'enum', enum: TipoSangre, nullable: true })
  tipo_sangre: TipoSangre | null = null;

  //relacion inversa, 1 historial medico puede tener muchos programas de diagnostico

  @OneToMany(() => ProgramaDiagnostico, (programa) => programa.historialMedico)
  programasDiagnostico?: ProgramaDiagnostico[];

  //1 historial medico puede tener muchos programas de puerperio
  @OneToMany(() => ProgramaPuerperio, (programa) => programa.historialMedico)
  programasPuerperio?: ProgramaPuerperio[];
}
