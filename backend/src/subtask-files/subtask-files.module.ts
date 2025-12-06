import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubtaskFile } from './entities/subtask-file.entity';
import { SubtaskFilesController } from './subtask-files.controller';
import { SubtaskFilesService } from './subtask-files.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubtaskFile])],
  controllers: [SubtaskFilesController],
  providers: [SubtaskFilesService],
  exports: [SubtaskFilesService],
})
export class SubtaskFilesModule {}
