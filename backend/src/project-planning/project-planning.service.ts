import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectPlanningDto } from './dto/create-project-planning.dto';
import { UpdateProjectPlanningDto } from './dto/update-project-planning.dto';
import { ProjectPlanning } from './entities/project-planning.entity';

@Injectable()
export class ProjectPlanningService {
  constructor(
    @InjectRepository(ProjectPlanning)
    private projectPlanningRepository: Repository<ProjectPlanning>,
  ) {}

  async create(
    createProjectPlanningDto: CreateProjectPlanningDto,
  ): Promise<ProjectPlanning> {
    const planning = this.projectPlanningRepository.create(
      createProjectPlanningDto,
    );
    return await this.projectPlanningRepository.save(planning);
  }

  async findAll(): Promise<ProjectPlanning[]> {
    return await this.projectPlanningRepository.find({
      relations: ['proyecto', 'creadoPor'],
    });
  }

  async findOne(id: number): Promise<ProjectPlanning> {
    const planning = await this.projectPlanningRepository.findOne({
      where: { id },
      relations: ['proyecto', 'creadoPor'],
    });

    if (!planning) {
      throw new NotFoundException(
        `Planificación con ID ${id} no encontrada`,
      );
    }

    return planning;
  }

  async findByProjectId(projectId: number): Promise<ProjectPlanning | null> {
    return await this.projectPlanningRepository.findOne({
      where: { projectId },
      relations: ['proyecto', 'creadoPor'],
    });
  }

  async update(
    id: number,
    updateProjectPlanningDto: UpdateProjectPlanningDto,
  ): Promise<ProjectPlanning> {
    const planning = await this.findOne(id);
    Object.assign(planning, updateProjectPlanningDto);
    return await this.projectPlanningRepository.save(planning);
  }

  async remove(id: number): Promise<void> {
    const planning = await this.findOne(id);
    await this.projectPlanningRepository.remove(planning);
  }
}
