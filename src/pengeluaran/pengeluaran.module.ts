import { Module } from '@nestjs/common';
import { PengeluaranService } from './pengeluaran.service';
import { PengeluaranController } from './pengeluaran.controller';

@Module({
  providers: [PengeluaranService],
  controllers: [PengeluaranController]
})
export class PengeluaranModule {}
