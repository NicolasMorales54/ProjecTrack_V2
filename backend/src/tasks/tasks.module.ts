import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AsignacionTarea } from './entities/asignacion-tarea.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, AsignacionTarea]),
    NotificationsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
