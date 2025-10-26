import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { Email } from './entities/email.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Email])],
  controllers: [EmailsController],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
