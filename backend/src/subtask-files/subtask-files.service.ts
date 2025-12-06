import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubtaskFile } from './entities/subtask-file.entity';
import { CreateSubtaskFileDto } from './dto/create-subtask-file.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SubtaskFilesService {
  constructor(
    @InjectRepository(SubtaskFile)
    private subtaskFilesRepository: Repository<SubtaskFile>,
  ) {}

  async create(createDto: CreateSubtaskFileDto): Promise<SubtaskFile> {
    const subtaskFile = this.subtaskFilesRepository.create(createDto);
    return await this.subtaskFilesRepository.save(subtaskFile);
  }

  async findBySubtaskId(subtaskId: number): Promise<SubtaskFile[]> {
    return await this.subtaskFilesRepository.find({
      where: { subtaskId },
      relations: ['uploadedBy'],
      order: { fechaSubida: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SubtaskFile> {
    const file = await this.subtaskFilesRepository.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });

    if (!file) {
      throw new NotFoundException(
        `Archivo de subtarea con ID ${id} no encontrado`,
      );
    }

    return file;
  }

  async getFilePath(id: number): Promise<string> {
    const file = await this.findOne(id);
    return path.join(process.cwd(), file.ruta);
  }

  async remove(id: number): Promise<void> {
    const file = await this.findOne(id);

    // Eliminar archivo físico
    const filePath = await this.getFilePath(id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Eliminar registro de BD
    await this.subtaskFilesRepository.delete(id);
  }
}
