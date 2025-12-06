import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateTimeRegisterDto } from './dto/update-time-register.dto';
import { CreateTimeRegisterDto } from './dto/create-time-register.dto';
import { TimeRegister } from './entities/time-register.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TimeRegisterService {
  constructor(
    @InjectRepository(TimeRegister)
    private readonly repo: Repository<TimeRegister>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateTimeRegisterDto) {
    const register = this.repo.create(dto);
    const saved = await this.repo.save(register);

    // Fetch task with project relation to get project creator
    const task = await this.taskRepo.findOne({
      where: { id: dto.taskId },
      relations: ['project'],
    });

    if (task && task.project) {
      // Get the user who registered the time
      const user = await this.userRepo.findOne({
        where: { id: dto.userId },
      });

      // Create notification for project creator (leader)
      const projectLeaderId = task.project.creadoPorId;

      // Only create notification if the user registering time is not the project leader
      if (projectLeaderId && projectLeaderId !== dto.userId) {
        const userName = user
          ? `${user.primerNombre} ${user.primerApellido}`
          : 'Un usuario';
        const message = `${userName} ha registrado tiempo en la tarea "${task.nombre}"`;

        await this.notificationsService.create({
          userId: projectLeaderId,
          mensaje: message,
          tipo: 'registro_tiempo',
          leida: false,
        });
      }
    }

    return saved;
  }

  findAll() {
    return this.repo.find({ relations: ['task', 'user'] });
  }

  async findOne(id: number) {
    const reg = await this.repo.findOne({
      where: { id },
      relations: ['task', 'user'],
    });
    if (!reg) throw new NotFoundException(`Registro ${id} no encontrado`);
    return reg;
  }

  async update(id: number, dto: UpdateTimeRegisterDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const reg = await this.findOne(id);
    return this.repo.remove(reg);
  }
}
