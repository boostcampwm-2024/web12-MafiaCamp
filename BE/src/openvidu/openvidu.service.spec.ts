import { Test, TestingModule } from '@nestjs/testing';
import { OpenviduService } from './openvidu.service';

describe('OpenviduService', () => {
  let service: OpenviduService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenviduService],
    }).compile();

    service = module.get<OpenviduService>(OpenviduService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
