import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { AsignarUsuarioProyectoDto } from './dto/asignar-usuario-proyecto.dto';
import { UsuarioProyecto } from './entities/usuario-proyecto.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }

  @Post('assign-user')
  asignarUsuarioProyecto(@Body() dto: AsignarUsuarioProyectoDto) {
    return this.projectsService.asignarUsuarioProyecto(dto);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.projectsService.findByUserId(userId);
  }

  @Get('user/:userId/group-by-estado')
  groupByEstadoAndUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.projectsService.groupByEstadoAndUserId(userId);
  }

  @Get(':id/users-not-in-project')
  async getUsersNotInProject(@Param('id') id: string) {
    return this.projectsService.findUsersNotInProject(+id);
  }
}
