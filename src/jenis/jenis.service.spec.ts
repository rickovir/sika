import { Test, TestingModule } from '@nestjs/testing';
import { JenisService } from './jenis.service';

describe('JenisService', () => {
  let service: JenisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JenisService],
    }).compile();

    service = module.get<JenisService>(JenisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
