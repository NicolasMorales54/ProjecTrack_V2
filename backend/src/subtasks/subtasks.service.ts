import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { AsignacionSubtarea } from './entities/asignacion-subtarea.entity';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { Subtask } from './entities/subtask.entity';

@Injectable()
export class SubtasksService {
  constructor(
    @InjectRepository(Subtask)
    private readonly subtaskRepository: Repository<Subtask>,
    @InjectRepository(AsignacionSubtarea)
    private readonly asignacionSubtareaRepository: Repository<AsignacionSubtarea>,
  ) {}

  create(createSubtaskDto: CreateSubtaskDto) {
    return 'This action adds a new subtask';
  }

  findAll() {
    return `This action returns all subtasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subtask`;
  }

  update(id: number, updateSubtaskDto: UpdateSubtaskDto) {
    return `This action updates a #${id} subtask`;
  }

  remove(id: number) {
    return `This action removes a #${id} subtask`;
  }

  async findByTaskId(taskId: number) {
    return this.subtaskRepository.find({ where: { taskId } });
  }

  async findByProjectId(projectId: number) {
    // Find all subtasks whose parent task has projectId
    return this.subtaskRepository
      .createQueryBuilder('subtask')
      .innerJoin('subtask.task', 'task')
      .where('task.projectId = :projectId', { projectId })
      .getMany();
  }

  async createForTask(taskId: number, dto: CreateSubtaskDto) {
    const subtask = this.subtaskRepository.create({ ...dto, taskId });
    return this.subtaskRepository.save(subtask);
  }

  async updateForTask(taskId: number, id: number, dto: UpdateSubtaskDto) {
    const subtask = await this.subtaskRepository.findOne({
      where: { id, taskId },
    });
    if (!subtask) throw new Error('Subtask not found for this task');
    Object.assign(subtask, dto);
    return this.subtaskRepository.save(subtask);
  }

  async updateForProject(projectId: number, id: number, dto: UpdateSubtaskDto) {
    // Find subtask by id, and check its parent task's projectId
    const subtask = await this.subtaskRepository
      .createQueryBuilder('subtask')
      .innerJoinAndSelect('subtask.task', 'task')
      .where('subtask.id = :id', { id })
      .andWhere('task.projectId = :projectId', { projectId })
      .getOne();
    if (!subtask) throw new Error('Subtask not found for this project');
    Object.assign(subtask, dto);
    return this.subtaskRepository.save(subtask);
  }

  async getSubtaskAssignments(subtaskId: number) {
    // Get all users assigned to this subtask
    const assignments = await this.asignacionSubtareaRepository.find({
      where: { subtaskId },
      relations: ['usuario'],
    });
    return assignments.map((a) => ({
      id: a.id,
      user: a.usuario,
    }));
  }

  async getSubtaskWithAssignmentsAndCreator(subtaskId: number) {
    // Get subtask with its creator and assigned users
    const subtask = await this.subtaskRepository.findOne({
      where: { id: subtaskId },
      relations: ['task', 'task.creadoPor'],
    });
    if (!subtask) throw new Error('Subtask not found');
    const assignments = await this.getSubtaskAssignments(subtaskId);
    return {
      subtask,
      createdBy: subtask.task ? subtask.task.creadoPor : null,
      assigned: assignments.map((a) => a.user),
    };
  }

  async assignUserToSubtask(subtaskId: number, userId: number) {
    // Prevent duplicate assignment
    const exists = await this.asignacionSubtareaRepository.findOne({
      where: { subtaskId, userId },
    });
    if (exists) {
      throw new Error('User already assigned to this subtask');
    }
    const assignment = this.asignacionSubtareaRepository.create({
      subtaskId,
      userId,
    });
    return this.asignacionSubtareaRepository.save(assignment);
  }
}
