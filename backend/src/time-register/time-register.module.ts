import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TimeRegisterController } from './time-register.controller';
import { TimeRegister } from './entities/time-register.entity';
import { TimeRegisterService } from './time-register.service';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeRegister, Task, User]),
    NotificationsModule,
  ],
  controllers: [TimeRegisterController],
  providers: [TimeRegisterService],
})
export class TimeRegisterModule {}
