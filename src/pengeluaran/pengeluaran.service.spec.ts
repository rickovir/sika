import { Test, TestingModule } from '@nestjs/testing';
import { PengeluaranService } from './pengeluaran.service';

describe('PengeluaranService', () => {
  let service: PengeluaranService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PengeluaranService],
    }).compile();

    service = module.get<PengeluaranService>(PengeluaranService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
