import { Test, TestingModule } from '@nestjs/testing';
import { TimeRegisterController } from './time-register.controller';
import { TimeRegisterService } from './time-register.service';

describe('TimeRegisterController', () => {
  let controller: TimeRegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeRegisterController],
      providers: [TimeRegisterService],
    }).compile();

    controller = module.get<TimeRegisterController>(TimeRegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
