import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectMilestoneDto } from './dto/create-project-milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project-milestone.dto';
import { ProjectMilestone } from './entities/project-milestone.entity';

@Injectable()
export class ProjectMilestonesService {
  constructor(
    @InjectRepository(ProjectMilestone)
    private projectMilestoneRepository: Repository<ProjectMilestone>,
  ) {}

  async create(
    createProjectMilestoneDto: CreateProjectMilestoneDto,
  ): Promise<ProjectMilestone> {
    const milestone = this.projectMilestoneRepository.create(
      createProjectMilestoneDto,
    );
    return await this.projectMilestoneRepository.save(milestone);
  }

  async findAll(): Promise<ProjectMilestone[]> {
    return await this.projectMilestoneRepository.find({
      relations: ['proyecto'],
      order: { orden: 'ASC', fechaObjetivo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ProjectMilestone> {
    const milestone = await this.projectMilestoneRepository.findOne({
      where: { id },
      relations: ['proyecto'],
    });

    if (!milestone) {
      throw new NotFoundException(`Hito con ID ${id} no encontrado`);
    }

    return milestone;
  }

  async findByProjectId(projectId: number): Promise<ProjectMilestone[]> {
    return await this.projectMilestoneRepository.find({
      where: { projectId },
      relations: ['proyecto'],
      order: { orden: 'ASC', fechaObjetivo: 'ASC' },
    });
  }

  async update(
    id: number,
    updateProjectMilestoneDto: UpdateProjectMilestoneDto,
  ): Promise<ProjectMilestone> {
    const milestone = await this.findOne(id);
    Object.assign(milestone, updateProjectMilestoneDto);
    return await this.projectMilestoneRepository.save(milestone);
  }

  async complete(id: number): Promise<ProjectMilestone> {
    const milestone = await this.findOne(id);
    milestone.completado = true;
    milestone.fechaCompletado = new Date();
    return await this.projectMilestoneRepository.save(milestone);
  }

  async remove(id: number): Promise<void> {
    const milestone = await this.findOne(id);
    await this.projectMilestoneRepository.remove(milestone);
  }
}
