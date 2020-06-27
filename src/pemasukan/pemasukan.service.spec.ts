import { Test, TestingModule } from '@nestjs/testing';
import { PemasukanService } from './pemasukan.service';

describe('PemasukanService', () => {
  let service: PemasukanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PemasukanService],
    }).compile();

    service = module.get<PemasukanService>(PemasukanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
