import { Test, TestingModule } from '@nestjs/testing';
import { TreinosController } from './treinos.controller';

describe('TreinosController', () => {
  let controller: TreinosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreinosController],
    }).compile();

    controller = module.get<TreinosController>(TreinosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
