import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';

@Entity('subtareas')
export class Subtask {
  @PrimaryGeneratedColumn({ name: 'id_subtarea' })
  id: number;

  @Column({ name: 'id_tarea' })
  taskId: number;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'id_tarea' })
  task: Task;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  texto?: string;

  @Column({ default: false })
  completada: boolean;
}
