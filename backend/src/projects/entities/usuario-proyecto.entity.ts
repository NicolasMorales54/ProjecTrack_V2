import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

import { Project } from './project.entity';

export enum RolEnProyecto {
  ADMIN = 'Administrador',
  LIDER = 'Líder de Proyecto',
  EMPLEADO = 'Empleado',
  CLIENTE = 'Cliente',
}

@Entity('usuarios_proyectos')
@Unique(['proyectoId', 'usuarioId'])
@Index('idx_usuarios_proyectos_id_proyecto', ['proyectoId'])
@Index('idx_usuarios_proyectos_id_usuario', ['usuarioId'])
export class UsuarioProyecto {
  @PrimaryGeneratedColumn({ name: 'id_usuario_proyecto' })
  id: number;

  @Column({ name: 'id_proyecto' })
  proyectoId: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'id_proyecto' })
  proyecto: Project;

  @Column({ name: 'id_usuario' })
  usuarioId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @Column({ name: 'rol_en_proyecto', type: 'enum', enum: RolEnProyecto })
  rolEnProyecto: RolEnProyecto;
}
