import { Test, TestingModule } from '@nestjs/testing';
import { PengeluaranController } from './pengeluaran.controller';

describe('Pengeluaran Controller', () => {
  let controller: PengeluaranController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PengeluaranController],
    }).compile();

    controller = module.get<PengeluaranController>(PengeluaranController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
