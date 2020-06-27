import { Test, TestingModule } from '@nestjs/testing';
import { JenisController } from './jenis.controller';

describe('Jenis Controller', () => {
  let controller: JenisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JenisController],
    }).compile();

    controller = module.get<JenisController>(JenisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
