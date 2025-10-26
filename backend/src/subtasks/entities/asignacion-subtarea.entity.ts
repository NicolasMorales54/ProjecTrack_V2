import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

import { Subtask } from './subtask.entity';

@Entity('asignaciones_subtareas')
export class AsignacionSubtarea {
  @PrimaryGeneratedColumn({ name: 'id_asignacion_subtarea' })
  id: number;

  @Column({ name: 'id_subtarea' })
  subtaskId: number;

  @ManyToOne(() => Subtask)
  @JoinColumn({ name: 'id_subtarea' })
  subtask: Subtask;

  @Column({ name: 'id_usuario' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;
}
