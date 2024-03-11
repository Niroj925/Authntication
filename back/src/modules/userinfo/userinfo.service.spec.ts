import { Test, TestingModule } from '@nestjs/testing';
import { UserinfoService } from './userinfo.service';

describe('UserinfoService', () => {
  let service: UserinfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserinfoService],
    }).compile();

    service = module.get<UserinfoService>(UserinfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
