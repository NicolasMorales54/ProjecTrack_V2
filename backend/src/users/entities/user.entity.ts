import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum Rol {
  ADMIN = 'Administrador',
  LIDER = 'Líder de Proyecto',
  EMPLEADO = 'Empleado',
  CLIENTE = 'Cliente',
}

@Entity('usuarios')
@Index('idx_usuarios_rol', ['rol'])
export class User {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id: number;

  @Column({ name: 'nombre_usuario', unique: true, length: 50 })
  nombreUsuario: string;

  @Column({ name: 'correo_electronico', unique: true, length: 100 })
  correoElectronico: string;

  @Column()
  contrasena?: string;

  @Column({ name: 'primer_nombre', length: 50 })
  primerNombre: string;

  @Column({ name: 'primer_apellido', length: 50 })
  primerApellido: string;

  @Column({ name: 'segundo_nombre', nullable: true, length: 50 })
  segundoNombre?: string;

  @Column({ name: 'segundo_apellido', length: 50 })
  segundoApellido: string;

  @Column({ type: 'enum', enum: Rol })
  rol: Rol;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @Column({ nullable: true })
  posicion?: string;
}
