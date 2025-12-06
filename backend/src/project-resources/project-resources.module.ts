import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectResourcesService } from './project-resources.service';
import { ProjectResourcesController } from './project-resources.controller';
import { ProjectResource } from './entities/project-resource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectResource])],
  controllers: [ProjectResourcesController],
  providers: [ProjectResourcesService],
  exports: [ProjectResourcesService],
})
export class ProjectResourcesModule {}
