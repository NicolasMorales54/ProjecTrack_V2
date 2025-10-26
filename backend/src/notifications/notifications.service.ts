import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      leida: createNotificationDto.leida ?? false,
    });
    return this.notificationRepository.save(notification);
  }

  async findAll() {
    return this.notificationRepository.find({
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.notificationRepository.findOneBy({ id });
  }

  async findByUserId(userId: number) {
    return this.notificationRepository.find({
      where: { userId },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    await this.notificationRepository.update(id, updateNotificationDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const notification = await this.findOne(id);
    if (notification) {
      await this.notificationRepository.delete(id);
    }
    return notification;
  }

  async markAsRead(id: number) {
    await this.notificationRepository.update(id, { leida: true });
    return this.findOne(id);
  }

  async markAllAsRead(userId: number) {
    await this.notificationRepository.update({ userId }, { leida: true });
    return this.findByUserId(userId);
  }
}
