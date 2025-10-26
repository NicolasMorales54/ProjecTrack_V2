import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAsignacionTareaDto } from './dto/create-asignacion-tarea.dto';
import { UpdateEstadoTareaDto } from './dto/update-estado-tarea.dto';
import { AsignacionTarea } from './entities/asignacion-tarea.entity';
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
    return this.asignacionTareaRepository.save(asignacion);
  }

  async updateEstado(id: number, dto: UpdateEstadoTareaDto) {
    const task = await this.findOne(id);
    task.estado = dto.estado;
    await this.taskRepository.save(task);
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
}
