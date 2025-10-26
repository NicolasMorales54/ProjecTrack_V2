import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

import { Project } from '../../projects/entities/project.entity';

export enum EstadoTarea {
  POR_HACER = 'Por Hacer',
  EN_PROGRESO = 'En Progreso',
  COMPLETADA = 'Completada',
  BLOQUEADA = 'Bloqueada',
}

export enum Prioridad {
  ALTA = 'Alta',
  MEDIA = 'Media',
  BAJA = 'Baja',
}

@Entity('tareas')
export class Task {
  @PrimaryGeneratedColumn({ name: 'id_tarea' })
  id: number;

  @Column({ name: 'id_proyecto' })
  projectId: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'id_proyecto' })
  project: Project;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'fecha_inicio', type: 'date', nullable: true })
  fechaInicio?: Date;

  @Column({ name: 'fecha_vencimiento', type: 'date', nullable: true })
  fechaVencimiento?: Date;

  @Column({ type: 'enum', enum: EstadoTarea })
  estado: EstadoTarea;

  @Column({ type: 'enum', enum: Prioridad })
  prioridad: Prioridad;

  @Column({ name: 'creado_por' })
  creadoPorId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creado_por' })
  creadoPor: User;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @Column({ nullable: true })
  categoria?: string;

  @Column({ name: 'solicitud_revision', default: false })
  solicitudRevision: boolean;

  @Column({ name: 'calificacion_revision', nullable: true })
  calificacionRevision?: number;

  @Column({ default: false })
  completada: boolean;
}
