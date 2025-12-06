import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TimeRegister } from './time-register/entities/time-register.entity';
import { Notification } from './notifications/entities/notification.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { TimeRegisterModule } from './time-register/time-register.module';
import { Subtask } from './subtasks/entities/subtask.entity';
import { Project } from './projects/entities/project.entity';
import { SubtasksModule } from './subtasks/subtasks.module';
import { ProjectsModule } from './projects/projects.module';
import { Email } from './emails/entities/email.entity';
import { EmailsModule } from './emails/emails.module';
import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { ProjectResourcesModule } from './project-resources/project-resources.module';
import { TaskFilesModule } from './task-files/task-files.module';
import { SubtaskFilesModule } from './subtask-files/subtask-files.module';
import { ProjectPlanningModule } from './project-planning/project-planning.module';
import { ProjectMilestonesModule } from './project-milestones/project-milestones.module';

@Module({
  imports: [
    UsersModule,
    ProjectsModule,
    TasksModule,
    SubtasksModule,
    TimeRegisterModule,
    NotificationsModule,
    EmailsModule,
    AuthModule,
    PassportModule,
    ProjectResourcesModule,
    TaskFilesModule,
    SubtaskFilesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'yofer',
      autoLoadEntities: true,
      synchronize: false,
      entities: [User, Task, Project],
    }),
    ProjectPlanningModule,
    ProjectMilestonesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
