import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Subtask } from 'src/subtasks/entities/subtask.entity';

export enum TipoRecurso {
  HUMANO = 'humano',
  MATERIAL = 'material',
  FINANCIERO = 'financiero',
}

@Entity('recursos_proyecto')
@Index('idx_tipo', ['tipo'])
export class ProjectResource {
  @PrimaryGeneratedColumn({ name: 'id_recurso' })
  id: number;

  @Column({ name: 'id_proyecto' })
  proyectoId: number;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_proyecto' })
  proyecto: Project;

  @Column({
    type: 'enum',
    enum: TipoRecurso,
  })
  tipo: TipoRecurso;

  @Column({ length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => value ? parseFloat(value) : null,
    }
  })
  cantidad?: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => value ? parseFloat(value) : null,
    }
  })
  costo?: number;

  @Column({ type: 'boolean', default: false })
  asignado: boolean;

  @Column({ name: 'id_tarea', nullable: true })
  tareaId?: number;

  @ManyToOne(() => Task, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'id_tarea' })
  tarea?: Task;

  @Column({ name: 'id_subtarea', nullable: true })
  subtareaId?: number;

  @ManyToOne(() => Subtask, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'id_subtarea' })
  subtarea?: Subtask;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
