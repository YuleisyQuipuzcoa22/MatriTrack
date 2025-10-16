import { Estado } from 'src/enums/Estado';
import { Sexo } from 'src/enums/Sexo';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('paciente')
export class Paciente {
  // PK: char(6). Se usa '!' porque el valor se genera en el Controller.
  @PrimaryColumn({ type: 'char', length: 6 })
  id_paciente!: string;

  // Columnas normales
  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  apellido!: string;

  @Column({ type: 'char', length: 8, unique: true, nullable: false })
  dni!: string;

  @Column({ type: 'date', nullable: false })
  fecha_nacimiento!: Date;

  @Column({ type: 'varchar', length: 50, nullable: false })
  direccion!: string;

  @Column({ type: 'enum', enum: Sexo, nullable: false })
  sexo!: Sexo;

  @Column({ type: 'varchar', length: 15, nullable: false })
  telefono!: string;

  @Column({ type: 'varchar', length: 254, unique: true, nullable: false })
  correo_electronico!: string;

  @Column({
    type: 'enum',
    enum: Estado,
    nullable: false,
    default: Estado.ACTIVO,
  })
  estado!: Estado;

  // Fecha de inhabilitación: puede ser null si el paciente está activo
  @Column({ type: 'date', nullable: true })
  fecha_inhabilitacion: Date | null = null;
}
