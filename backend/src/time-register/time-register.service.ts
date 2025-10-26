import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateTimeRegisterDto } from './dto/update-time-register.dto';
import { CreateTimeRegisterDto } from './dto/create-time-register.dto';
import { TimeRegister } from './entities/time-register.entity';

@Injectable()
export class TimeRegisterService {
  constructor(
    @InjectRepository(TimeRegister)
    private readonly repo: Repository<TimeRegister>,
  ) {}

  create(dto: CreateTimeRegisterDto) {
    const register = this.repo.create(dto);
    return this.repo.save(register);
  }

  findAll() {
    return this.repo.find({ relations: ['task', 'user'] });
  }

  async findOne(id: number) {
    const reg = await this.repo.findOne({
      where: { id },
      relations: ['task', 'user'],
    });
    if (!reg) throw new NotFoundException(`Registro ${id} no encontrado`);
    return reg;
  }

  async update(id: number, dto: UpdateTimeRegisterDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const reg = await this.findOne(id);
    return this.repo.remove(reg);
  }
}
