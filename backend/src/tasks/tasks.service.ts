import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAsignacionTareaDto } from './dto/create-asignacion-tarea.dto';
import { UpdateEstadoTareaDto } from './dto/update-estado-tarea.dto';
import { AsignacionTarea } from './entities/asignacion-tarea.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(AsignacionTarea)
    private readonly asignacionTareaRepository: Repository<AsignacionTarea>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  create(dto: CreateTaskDto) {
    const task = this.taskRepository.create(dto);
    return this.taskRepository.save(task);
  }

  findAll() {
    return this.taskRepository.find({
      relations: ['project', 'creadoPor'],
    });
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'creadoPor'],
    });
    if (!task) throw new NotFoundException(`Tarea ${id} no encontrada`);
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    await this.taskRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    return this.taskRepository.remove(task);
  }

  async findByProjectId(projectId: number) {
    return this.taskRepository.find({
      where: { projectId },
      relations: ['project', 'creadoPor'],
    });
  }

  async findByUserId(userId: number) {
    return this.taskRepository.find({
      where: { creadoPorId: userId },
      relations: ['project', 'creadoPor'],
    });
  }

  async asignarTarea(dto: CreateAsignacionTareaDto) {
    const asignacion = this.asignacionTareaRepository.create(dto);
    const savedAsignacion = await this.asignacionTareaRepository.save(asignacion);

    // Obtener información de la tarea y quien la asignó
    const task = await this.findOne(dto.taskId);
    const assignedByName = task.creadoPor
      ? `${task.creadoPor.primerNombre} ${task.creadoPor.primerApellido}`
      : 'Sistema';

    // Emitir notificación al usuario asignado
    await this.notificationsGateway.notifyTaskAssigned(
      dto.usuarioId,
      task.id,
      task.nombre,
      assignedByName,
    );

    return savedAsignacion;
  }

  async updateEstado(id: number, dto: UpdateEstadoTareaDto) {
    const task = await this.findOne(id);
    const previousEstado = task.estado;
    task.estado = dto.estado;
    await this.taskRepository.save(task);

    // Si la tarea se marcó como completada, notificar al líder/creador
    if (dto.estado === 'Completada' && previousEstado !== 'Completada') {
      // Notificar al creador de la tarea
      if (task.creadoPorId) {
        await this.notificationsGateway.notifyTaskCompleted(
          task.creadoPorId,
          task.id,
          task.nombre,
          'Un miembro del equipo',
        );
      }

      // TODO: También notificar al líder del proyecto si es diferente del creador
    }

    return task;
  }

  async updatePrioridad(
    id: number,
    dto: import('./dto/update-prioridad-tarea.dto').UpdatePrioridadTareaDto,
  ) {
    const task = await this.findOne(id);
    task.prioridad = dto.prioridad;
    await this.taskRepository.save(task);
    return task;
  }

  async findOneByProjectId(projectId: number, id: number) {
    return this.taskRepository.findOne({ where: { id, projectId } });
  }

  async findOneByUserId(userId: number, id: number) {
    return this.taskRepository.findOne({ where: { id, creadoPorId: userId } });
  }

  // FASE 6: Obtener tareas para calendario
  async getTasksForCalendar(userId: number) {
    // Obtener tareas asignadas al usuario con información necesaria para el calendario
    const asignaciones = await this.asignacionTareaRepository.find({
      where: { usuarioId: userId },
      relations: ['tarea', 'tarea.project'],
    });

    return asignaciones.map((asignacion) => ({
      id: asignacion.tarea.id,
      nombre: asignacion.tarea.nombre,
      descripcion: asignacion.tarea.descripcion,
      fechaInicio: asignacion.tarea.fechaInicio,
      fechaVencimiento: asignacion.tarea.fechaVencimiento,
      estado: asignacion.tarea.estado,
      prioridad: asignacion.tarea.prioridad,
      projectId: asignacion.tarea.projectId,
      projectName: asignacion.tarea.project?.nombre || 'Sin proyecto',
    }));
  }
}
