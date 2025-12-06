import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsuarioProyecto } from './entities/usuario-proyecto.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { ProjectHistory } from './entities/project-history.entity';
import { ProjectsReportService } from './projects-report.service';
import { ProjectResourcesModule } from 'src/project-resources/project-resources.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, UsuarioProyecto, ProjectHistory]),
    ProjectResourcesModule,
    NotificationsModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsReportService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
