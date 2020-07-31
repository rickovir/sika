import { Module } from '@nestjs/common';
import { PengeluaranService } from './pengeluaran.service';
import { PengeluaranController } from './pengeluaran.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PengeluaranEntity } from './pengeluaran.entity';
import { TransaksiModule } from 'src/transaksi/transaksi.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([PengeluaranEntity]),
    TransaksiModule
  ],
  providers: [PengeluaranService],
  controllers: [PengeluaranController]
})
export class PengeluaranModule {}
