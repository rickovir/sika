import { Module } from '@nestjs/common';
import { JenisController } from './jenis.controller';
import { JenisService } from './jenis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JenisEntity } from './jenis.entity';

@Module({
  imports:[TypeOrmModule.forFeature([JenisEntity])],
  controllers: [JenisController],
  providers: [JenisService],
  exports:[JenisService]
})
export class JenisModule {}
