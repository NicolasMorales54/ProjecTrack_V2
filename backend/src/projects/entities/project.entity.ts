import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
// src/projects/entities/project.entity.ts
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';

export enum EstadoProyecto {
  ABIERTO = 'Abierto',
  EN_PROGRESO = 'En Progreso',
  COMPLETADO = 'Completado',
  ARCHIVADO = 'Archivado',
  PAUSADO = 'Pausado',
}

@Entity('proyectos')
@Index('idx_proyectos_estado', ['estado'])
export class Project {
  @PrimaryGeneratedColumn({ name: 'id_proyecto' })
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'fecha_inicio', type: 'date', nullable: true })
  fechaInicio?: Date;

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fechaFin?: Date;

  @Column({
    type: 'enum',
    enum: EstadoProyecto,
    nullable: true,
  })
  estado: EstadoProyecto;

  @Column({ name: 'creado_por' })
  creadoPorId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creado_por' })
  creadoPor: User;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @Column({ type: 'boolean', default: false })
  eliminado: boolean;

  // Campos de auditoría para archivado
  @Column({ name: 'archivado_por', nullable: true })
  archivadoPorId?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'archivado_por' })
  archivadoPor?: User;

  @Column({ name: 'fecha_archivado', type: 'datetime', nullable: true })
  fechaArchivado?: Date;

  // Campos de auditoría para eliminación
  @Column({ name: 'eliminado_por', nullable: true })
  eliminadoPorId?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'eliminado_por' })
  eliminadoPor?: User;

  @Column({ name: 'fecha_eliminado', type: 'datetime', nullable: true })
  fechaEliminado?: Date;

  // Campos de auditoría para pausado
  @Column({ name: 'pausado_por', nullable: true })
  pausadoPorId?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'pausado_por' })
  pausadoPor?: User;

  @Column({ name: 'fecha_pausado', type: 'datetime', nullable: true })
  fechaPausado?: Date;

  // FASE 6: Relación con tareas para cronograma
  @OneToMany(() => Task, (task) => task.project)
  tareas?: Task[];
}
