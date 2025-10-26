import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity('asignaciones_tareas')
@Unique(['taskId', 'usuarioId'])
export class AsignacionTarea {
  @PrimaryGeneratedColumn({ name: 'id_asignacion_tarea' })
  id: number;

  @Column({ name: 'id_tarea' })
  taskId: number;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'id_tarea' })
  tarea: Task;

  @Column({ name: 'id_usuario' })
  usuarioId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;
}
