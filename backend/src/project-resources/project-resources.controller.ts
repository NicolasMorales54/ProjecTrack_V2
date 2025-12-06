import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProjectResourcesService } from './project-resources.service';
import { CreateProjectResourceDto } from './dto/create-project-resource.dto';
import { UpdateProjectResourceDto } from './dto/update-project-resource.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('project-resources')
@UseGuards(JwtAuthGuard)
export class ProjectResourcesController {
  constructor(private readonly projectResourcesService: ProjectResourcesService) {}

  @Post()
  create(@Body() createProjectResourceDto: CreateProjectResourceDto) {
    console.log('📝 [ProjectResourcesController] Received DTO:', JSON.stringify(createProjectResourceDto, null, 2));
    return this.projectResourcesService.create(createProjectResourceDto);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectResourcesService.findByProjectId(projectId);
  }

  @Get('project/:projectId/summary')
  getResourcesSummary(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectResourcesService.getResourcesSummaryByProject(projectId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectResourcesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectResourceDto: UpdateProjectResourceDto,
  ) {
    return this.projectResourcesService.update(id, updateProjectResourceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectResourcesService.remove(id);
  }
}
