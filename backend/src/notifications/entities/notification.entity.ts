import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('notificacion')
export class Notification {
  @PrimaryGeneratedColumn({ name: 'id_notificacion' })
  id: number;

  @Column({ name: 'id_usuario' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ length: 50, nullable: true })
  tipo: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @Column({ default: false })
  leida: boolean;
}
