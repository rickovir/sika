import { Module } from '@nestjs/common';
import { PemasukanController } from './pemasukan.controller';
import { PemasukanService } from './pemasukan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PemasukanEntity } from './pemasukan.entity';
import { TransaksiModule } from 'src/transaksi/transaksi.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([PemasukanEntity]),
    TransaksiModule
  ],
  controllers: [PemasukanController],
  providers: [PemasukanService]
})
export class PemasukanModule {}
