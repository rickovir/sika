import { Module } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { TransaksiController } from './transaksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaksiEntity } from './transaksi.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TransaksiEntity])],
  providers: [TransaksiService],
  controllers: [TransaksiController],
  exports:[TransaksiService]
})
export class TransaksiModule {}
