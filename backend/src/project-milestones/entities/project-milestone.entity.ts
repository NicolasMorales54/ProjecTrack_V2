import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('hitos_proyecto')
export class ProjectMilestone {
  @PrimaryGeneratedColumn({ name: 'id_hito' })
  id: number;

  @Column({ name: 'id_proyecto' })
  projectId: number;

  @Column({ length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'fecha_objetivo', type: 'date' })
  fechaObjetivo: Date;

  @Column({ type: 'tinyint', default: false })
  completado: boolean;

  @Column({ name: 'fecha_completado', type: 'date', nullable: true })
  fechaCompletado: Date;

  @Column({ default: 0 })
  orden: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'id_proyecto' })
  proyecto: Project;
}
