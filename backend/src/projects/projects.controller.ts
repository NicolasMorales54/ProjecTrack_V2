import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Res,
  Header,
} from '@nestjs/common';
import { Response } from 'express';

import { AsignarUsuarioProyectoDto } from './dto/asignar-usuario-proyecto.dto';
import { UsuarioProyecto } from './entities/usuario-proyecto.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { ProjectsReportService } from './projects-report.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectsReportService: ProjectsReportService,
  ) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
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

  @Get(':id/history')
  async getProjectHistory(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getProjectHistory(id);
  }

  @Get(':id/report')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="reporte-proyecto.pdf"')
  async generateReport(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.projectsReportService.generateProjectReport(id);
    res.send(pdfBuffer);
  }

  // Phase 3: Soft delete
  @Patch(':id/soft-delete')
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { usuarioId: number },
  ) {
    return this.projectsService.softDelete(id, body.usuarioId);
  }

  // Phase 3: Change project state
  @Patch(':id/change-estado')
  async changeEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { estado: string; usuarioId: number },
  ) {
    return this.projectsService.changeEstado(id, body.estado, body.usuarioId);
  }

  @Patch(':projectId/user/:userId/role')
  async updateProjectUserRole(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { rolEnProyecto: string },
  ) {
    return this.projectsService.updateProjectUserRole(
      projectId,
      userId,
      body.rolEnProyecto,
    );
  }

  @Delete(':projectId/user/:userId')
  async removeUserFromProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.projectsService.removeUserFromProject(projectId, userId);
  }

  // FASE 6: Timeline endpoint
  @Get(':id/timeline')
  async getTimeline(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getTimeline(id);
  }

  // Generic CRUD routes must come LAST to avoid matching specific routes
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
}
 
