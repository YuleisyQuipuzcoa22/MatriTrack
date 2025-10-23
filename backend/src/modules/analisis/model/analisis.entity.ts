// src/modules/analisis/entities/analisis.entity.ts
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ResultadoAnalisis } from 'src/modules/resultado-analisis/model/resultado-analisis.entity';
@Entity('analisis')
export class Analisis {
  // PK: char(6)
  @PrimaryColumn({ type: 'char', length: 6 })
  id_analisis!: string;

  @Column({ type: 'varchar', length: 55, nullable: false, unique: true})
  nombre_analisis!: string;

  @Column({ type: 'varchar', length: 155, nullable: true })
  descripcion_analisis: string | null = null;
}