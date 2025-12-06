import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectPlanningService } from './project-planning.service';
import { ProjectPlanningController } from './project-planning.controller';
import { ProjectPlanning } from './entities/project-planning.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectPlanning])],
  controllers: [ProjectPlanningController],
  providers: [ProjectPlanningService],
  exports: [ProjectPlanningService],
})
export class ProjectPlanningModule {}
