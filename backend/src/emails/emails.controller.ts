import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { UpdateEmailDto } from './dto/update-email.dto';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailsService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post()
  async create(@Body() createEmailDto: CreateEmailDto) {
    return this.emailsService.create(createEmailDto);
  }

  @Get()
  async findAll() {
    return this.emailsService.findAll();
  }

  @Get('sender/:senderId')
  async findBySenderId(@Param('senderId') senderId: string) {
    return this.emailsService.findBySenderId(+senderId);
  }

  @Get('receiver/:receiverId')
  async findByReceiverId(@Param('receiverId') receiverId: string) {
    return this.emailsService.findByReceiverId(+receiverId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.emailsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return this.emailsService.update(+id, updateEmailDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.emailsService.remove(+id);
    return { message: 'Email deleted successfully' };
  }
}
