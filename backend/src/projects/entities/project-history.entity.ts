import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('historial_proyecto')
@Index('idx_fecha', ['fecha'])
export class ProjectHistory {
  @PrimaryGeneratedColumn({ name: 'id_historial' })
  id: number;

  @Column({ name: 'id_proyecto' })
  proyectoId: number;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_proyecto' })
  proyecto: Project;

  @Column({ length: 100, comment: 'Tipo de acción: creado, actualizado, cambio_estado, eliminado' })
  accion: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'id_usuario', nullable: true })
  usuarioId?: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: User;

  @CreateDateColumn()
  fecha: Date;
}
