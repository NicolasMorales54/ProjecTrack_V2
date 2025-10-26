import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UpdateEmailDto } from './dto/update-email.dto';
import { CreateEmailDto } from './dto/create-email.dto';
import { Email } from './entities/email.entity';

@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
  ) {}

  async create(createEmailDto: CreateEmailDto): Promise<Email> {
    const email = this.emailRepository.create(createEmailDto);
    const savedEmail = await this.emailRepository.save(email);

    // Return the email with relations loaded
    const emailWithRelations = await this.emailRepository.findOne({
      where: { id: savedEmail.id },
      relations: ['remitente', 'destinatario'],
    });

    if (!emailWithRelations) {
      throw new Error('Failed to create email');
    }

    return emailWithRelations;
  }

  async findAll(): Promise<Email[]> {
    return this.emailRepository.find({
      relations: ['remitente', 'destinatario'],
      order: { fechaEnvio: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Email | null> {
    return this.emailRepository.findOne({
      where: { id },
      relations: ['remitente', 'destinatario'],
    });
  }

  async update(id: number, updateEmailDto: UpdateEmailDto): Promise<Email> {
    await this.emailRepository.update(id, updateEmailDto);
    const updatedEmail = await this.findOne(id);

    if (!updatedEmail) {
      throw new Error('Email not found');
    }

    return updatedEmail;
  }

  async remove(id: number): Promise<void> {
    await this.emailRepository.delete(id);
  }

  async findBySenderId(senderId: number): Promise<Email[]> {
    return this.emailRepository.find({
      where: { remitenteId: senderId },
      relations: ['remitente', 'destinatario'],
      order: { fechaEnvio: 'DESC' },
    });
  }

  async findByReceiverId(receiverId: number): Promise<Email[]> {
    return this.emailRepository.find({
      where: { destinatarioId: receiverId },
      relations: ['remitente', 'destinatario'],
      order: { fechaEnvio: 'DESC' },
    });
  }
}
