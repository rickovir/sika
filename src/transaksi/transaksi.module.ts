import { Module } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { TransaksiController } from './transaksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaksiEntity } from './transaksi.entity';
import { JenisModule } from 'src/jenis/jenis.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([TransaksiEntity]),
    JenisModule
  ],
  providers: [TransaksiService],
  controllers: [TransaksiController],
  exports:[TransaksiService]
})
export class TransaksiModule {}
