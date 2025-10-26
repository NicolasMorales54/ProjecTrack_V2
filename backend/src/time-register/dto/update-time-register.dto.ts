import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeRegisterDto } from './create-time-register.dto';

export class UpdateTimeRegisterDto extends PartialType(CreateTimeRegisterDto) {}
