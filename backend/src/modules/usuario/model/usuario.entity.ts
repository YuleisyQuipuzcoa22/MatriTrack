import { Estado } from 'src/enums/Estado';
import { RolUsuario } from 'src/enums/RolUsuario';
import { Entity, PrimaryColumn, Column } from 'typeorm';

// import * as bcrypt from 'bcryptjs'; // Comentado por ahora

@Entity('usuario')
export class Usuario {
  // PK: char(6). Se usa '!' porque el valor se genera en el Controller.
  //clave primaria
  @PrimaryColumn({ type: 'char', length: 6 })
  id_usuario!: string;

  //columnas normales
  @Column({ type: 'char', length: 8, unique: true, nullable: false })
  dni!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  apellido!: string;

  // Contraseña: Se marca select: false para que TypeORM no la traiga por defecto cuando se consulta un usuario, por seguridad

  @Column({ type: 'varchar', length: 64, nullable: false, select: false })
  contrasena!: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    nullable: false,
    default: RolUsuario.OBSTETRA,
  })
  rol!: RolUsuario;

  @Column({
    type: 'enum',
    enum: Estado,
    nullable: false,
    default: Estado.ACTIVO,
  })
  estado!: Estado;

  @Column({ type: 'date', nullable: false })
  fecha_nacimiento!: Date;

  @Column({ type: 'varchar', length: 254, unique: true, nullable: false })
  correo_electronico!: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  telefono!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  direccion?: string;

  // Puede ser null para el Administrador
  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  numero_colegiatura: string | null = null;

  /*
  // TEMPORALMENTE DESACTIVADO PARA DESARROLLO (Contraseña en texto plano)
  // *** RECUERDA ACTIVAR ESTO Y EL HASH EN EL LOGIN ANTES DE PRODUCIR ***
  /*@BeforeInsert() async hashPassword() 
  { const salt = await bcrypt.genSalt(10); 
   this.contrasena = await bcrypt.hash(this.contrasena, salt); }*/
}
