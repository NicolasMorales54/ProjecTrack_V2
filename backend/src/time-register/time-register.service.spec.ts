import { Test, TestingModule } from '@nestjs/testing';
import { TimeRegisterService } from './time-register.service';

describe('TimeRegisterService', () => {
  let service: TimeRegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeRegisterService],
    }).compile();

    service = module.get<TimeRegisterService>(TimeRegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
