import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('correos')
export class Email {
  @PrimaryGeneratedColumn({ name: 'id_correo' })
  id: number;

  @Column({ name: 'id_destinatario' })
  destinatarioId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_destinatario' })
  destinatario: User;

  @Column({ name: 'id_remitente' })
  remitenteId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_remitente' })
  remitente: User;

  @Column({ length: 255 })
  asunto: string;

  @Column({ type: 'text' })
  cuerpo: string;

  @CreateDateColumn({ name: 'fecha_envio' })
  fechaEnvio: Date;
}
