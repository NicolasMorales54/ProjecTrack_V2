// src/time-register/entities/time-register.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

import { Task } from '../../tasks/entities/task.entity';

@Entity('registro_tiempo_tareas')
export class TimeRegister {
  @PrimaryGeneratedColumn({ name: 'id_registro_tiempo' })
  id: number;

  @Column({ name: 'id_tarea' })
  taskId: number;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'id_tarea' })
  task: Task;

  @Column({ name: 'id_usuario' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @Column({ name: 'tiempo_inicio', type: 'timestamp', nullable: true })
  tiempoInicio?: Date;

  @Column({ name: 'tiempo_fin', type: 'timestamp', nullable: true })
  tiempoFin?: Date;

  @Column({
    name: 'fecha_registro',
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  fechaRegistro: Date;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
