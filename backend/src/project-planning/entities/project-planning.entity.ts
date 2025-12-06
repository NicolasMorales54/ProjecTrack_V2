import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('planificacion_proyecto')
export class ProjectPlanning {
  @PrimaryGeneratedColumn({ name: 'id_planificacion' })
  id: number;

  @Column({ name: 'id_proyecto' })
  projectId: number;

  @Column({ type: 'text', nullable: true })
  objetivos: string;

  @Column({ type: 'text', nullable: true })
  alcance: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  presupuesto: number;

  @Column({ name: 'fecha_clave_inicio', type: 'date', nullable: true })
  fechaClaveInicio: Date;

  @Column({ name: 'fecha_clave_fin', type: 'date', nullable: true })
  fechaClaveFin: Date;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ name: 'id_creado_por', nullable: true })
  creadoPorId: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'id_proyecto' })
  proyecto: Project;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_creado_por' })
  creadoPor: User;
}
