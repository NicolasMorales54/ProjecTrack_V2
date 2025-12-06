import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Subtask } from '../../subtasks/entities/subtask.entity';
import { User } from '../../users/entities/user.entity';

@Entity('archivos_subtarea')
export class SubtaskFile {
  @PrimaryGeneratedColumn({ name: 'id_archivo' })
  id: number;

  @Column({ name: 'id_subtarea' })
  subtaskId: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 500 })
  ruta: string;

  @Column({ length: 50, nullable: true })
  tipo: string;

  @Column({ nullable: true })
  tamano: number;

  @Column({ name: 'id_subido_por', nullable: true })
  uploadedById: number;

  @CreateDateColumn({
    name: 'fecha_subida',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaSubida: Date;

  @ManyToOne(() => Subtask, (subtask) => subtask.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_subtarea' })
  subtask: Subtask;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_subido_por' })
  uploadedBy: User;
}
