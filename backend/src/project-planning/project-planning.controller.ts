import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectPlanningService } from './project-planning.service';
import { CreateProjectPlanningDto } from './dto/create-project-planning.dto';
import { UpdateProjectPlanningDto } from './dto/update-project-planning.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('project-planning')
@UseGuards(JwtAuthGuard)
export class ProjectPlanningController {
  constructor(
    private readonly projectPlanningService: ProjectPlanningService,
  ) {}

  @Post()
  create(@Body() createProjectPlanningDto: CreateProjectPlanningDto) {
    return this.projectPlanningService.create(createProjectPlanningDto);
  }

  @Get()
  findAll() {
    return this.projectPlanningService.findAll();
  }

  @Get('project/:projectId')
  findByProjectId(@Param('projectId') projectId: string) {
    return this.projectPlanningService.findByProjectId(+projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectPlanningService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectPlanningDto: UpdateProjectPlanningDto,
  ) {
    return this.projectPlanningService.update(+id, updateProjectPlanningDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectPlanningService.remove(+id);
  }
}
