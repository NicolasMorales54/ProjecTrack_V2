import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectResource } from './entities/project-resource.entity';
import { CreateProjectResourceDto } from './dto/create-project-resource.dto';
import { UpdateProjectResourceDto } from './dto/update-project-resource.dto';

@Injectable()
export class ProjectResourcesService {
  constructor(
    @InjectRepository(ProjectResource)
    private readonly projectResourceRepository: Repository<ProjectResource>,
  ) {}

  async create(createDto: CreateProjectResourceDto): Promise<ProjectResource> {
    const resource = this.projectResourceRepository.create(createDto);
    const savedResource = await this.projectResourceRepository.save(resource);

    // Reload with relations to return complete data
    const resourceWithRelations = await this.projectResourceRepository.findOne({
      where: { id: savedResource.id },
      relations: ['tarea', 'subtarea'],
    });

    if (!resourceWithRelations) {
      throw new NotFoundException(`Recurso recién creado no encontrado`);
    }

    return resourceWithRelations;
  }

  async findByProjectId(projectId: number): Promise<ProjectResource[]> {
    return await this.projectResourceRepository.find({
      where: { proyectoId: projectId },
      relations: ['tarea', 'subtarea'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ProjectResource> {
    const resource = await this.projectResourceRepository.findOne({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
    }

    return resource;
  }

  async update(id: number, updateDto: UpdateProjectResourceDto): Promise<ProjectResource> {
    const resource = await this.findOne(id);
    Object.assign(resource, updateDto);
    await this.projectResourceRepository.save(resource);

    // Reload with relations to return complete data
    const updatedResource = await this.projectResourceRepository.findOne({
      where: { id },
      relations: ['tarea', 'subtarea'],
    });

    if (!updatedResource) {
      throw new NotFoundException(`Recurso con ID ${id} no encontrado después de actualizar`);
    }

    return updatedResource;
  }

  async remove(id: number): Promise<void> {
    const resource = await this.findOne(id);
    await this.projectResourceRepository.remove(resource);
  }

  async getResourcesSummaryByProject(projectId: number) {
    const resources = await this.findByProjectId(projectId);

    const summary = {
      humanos: resources.filter(r => r.tipo === 'humano'),
      materiales: resources.filter(r => r.tipo === 'material'),
      financieros: resources.filter(r => r.tipo === 'financiero'),
      costoTotal: resources.reduce((sum, r) => sum + (Number(r.costo) || 0), 0),
    };

    return summary;
  }
}
