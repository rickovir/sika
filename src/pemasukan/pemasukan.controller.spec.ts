import { Test, TestingModule } from '@nestjs/testing';
import { PemasukanController } from './pemasukan.controller';

describe('Pemasukan Controller', () => {
  let controller: PemasukanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PemasukanController],
    }).compile();

    controller = module.get<PemasukanController>(PemasukanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
