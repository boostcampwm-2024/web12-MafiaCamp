import { Test, TestingModule } from '@nestjs/testing';
import { OpenviduController } from './openvidu.controller';
import { OpenviduService } from './openvidu.service';

describe('OpenviduController', () => {
  let controller: OpenviduController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenviduController],
      providers: [OpenviduService],
    }).compile();

    controller = module.get<OpenviduController>(OpenviduController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
