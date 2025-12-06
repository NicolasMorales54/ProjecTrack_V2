import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Entity('archivos_tarea')
export class TaskFile {
  @PrimaryGeneratedColumn({ name: 'id_archivo' })
  id: number;

  @Column({ name: 'id_tarea' })
  taskId: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 500 })
  ruta: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo: string;

  @Column({ name: 'tamano', type: 'int', nullable: true })
  tamano: number;

  @Column({ name: 'id_subido_por', nullable: true })
  uploadedById: number;

  @CreateDateColumn({ name: 'fecha_subida', type: 'timestamp' })
  fechaSubida: Date;

  // Relaciones
  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_tarea' })
  task: Task;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_subido_por' })
  uploadedBy: User;
}
