import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransaksiEntity } from './transaksi.entity';
import { Repository } from 'typeorm';
import { CreateTransaksiDTO } from './transaksi.dto';

@Injectable()
export class TransaksiService {
    private readonly logger = new Logger(TransaksiService.name);
    
    constructor(
        @InjectRepository(TransaksiEntity) private transaksiRepo:Repository<TransaksiEntity>
    ){}

    public async createPemasukan(data:CreateTransaksiDTO)
    {
        try{
            let query = `CALL createPemasukan('${data.jenisID}', '${data.nomorKas}', '${data.tanggal}', '${data.namaPenanggungJawab}', '${data.jumlah}', '${data.judul}', '${data.imageUrl}', '${data.keterangan}')`;
            this.logger.log(query)
            const res = await this.transaksiRepo.query(query);
            if(res) return true;
        }
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    public async createPengeluaran(data:CreateTransaksiDTO)
    {
        try{
            let query = `CALL createPengeluaran('${data.jenisID}', '${data.nomorKas}', '${data.tanggal}', '${data.namaPenanggungJawab}', '${data.jumlah}', '${data.judul}', '${data.imageUrl}', '${data.keterangan}')`;
            const res = await this.transaksiRepo.query(query);
            if(res)
                return true;
        }
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}
