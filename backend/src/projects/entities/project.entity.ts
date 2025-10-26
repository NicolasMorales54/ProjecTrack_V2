import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
// src/projects/entities/project.entity.ts
import { User } from 'src/users/entities/user.entity';

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
}
