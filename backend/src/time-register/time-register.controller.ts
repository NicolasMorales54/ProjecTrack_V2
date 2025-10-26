import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TimeRegisterService } from './time-register.service';
import { CreateTimeRegisterDto } from './dto/create-time-register.dto';
import { UpdateTimeRegisterDto } from './dto/update-time-register.dto';

@Controller('time-register')
export class TimeRegisterController {
  constructor(private readonly timeRegisterService: TimeRegisterService) {}

  @Post()
  create(@Body() createTimeRegisterDto: CreateTimeRegisterDto) {
    return this.timeRegisterService.create(createTimeRegisterDto);
  }

  @Get()
  findAll() {
    return this.timeRegisterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeRegisterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimeRegisterDto: UpdateTimeRegisterDto,
  ) {
    return this.timeRegisterService.update(+id, updateTimeRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeRegisterService.remove(+id);
  }
}
