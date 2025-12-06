import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskFile } from './entities/task-file.entity';
import { CreateTaskFileDto } from './dto/create-task-file.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TaskFilesService {
  constructor(
    @InjectRepository(TaskFile)
    private taskFilesRepository: Repository<TaskFile>,
  ) {}

  async create(createTaskFileDto: CreateTaskFileDto): Promise<TaskFile> {
    const taskFile = this.taskFilesRepository.create(createTaskFileDto);
    return await this.taskFilesRepository.save(taskFile);
  }

  async findByTaskId(taskId: number): Promise<TaskFile[]> {
    return await this.taskFilesRepository.find({
      where: { taskId },
      relations: ['uploadedBy'],
      order: { fechaSubida: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TaskFile> {
    const file = await this.taskFilesRepository.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });
    if (!file) {
      throw new NotFoundException(`Archivo con ID ${id} no encontrado`);
    }
    return file;
  }

  async remove(id: number): Promise<void> {
    const file = await this.findOne(id);

    // Eliminar archivo físico si existe
    const filePath = path.join(process.cwd(), file.ruta);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.taskFilesRepository.delete(id);
  }

  async getFilePath(id: number): Promise<string> {
    const file = await this.findOne(id);
    return path.join(process.cwd(), file.ruta);
  }
}
