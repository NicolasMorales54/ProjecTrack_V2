import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskFilesController } from './task-files.controller';
import { TaskFilesService } from './task-files.service';
import { TaskFile } from './entities/task-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskFile])],
  controllers: [TaskFilesController],
  providers: [TaskFilesService],
  exports: [TaskFilesService],
})
export class TaskFilesModule {}
