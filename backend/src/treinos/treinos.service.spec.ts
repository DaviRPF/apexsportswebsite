import { Test, TestingModule } from '@nestjs/testing';
import { TreinosService } from './treinos.service';

describe('TreinosService', () => {
  let service: TreinosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TreinosService],
    }).compile();

    service = module.get<TreinosService>(TreinosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
