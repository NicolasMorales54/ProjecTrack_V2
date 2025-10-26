import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TimeRegisterController } from './time-register.controller';
import { TimeRegister } from './entities/time-register.entity';
import { TimeRegisterService } from './time-register.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimeRegister])],
  controllers: [TimeRegisterController],
  providers: [TimeRegisterService],
})
export class TimeRegisterModule {}
