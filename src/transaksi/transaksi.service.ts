import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransaksiEntity } from './transaksi.entity';
import { Repository } from 'typeorm';
import { CreateTransaksiDTO } from './transaksi.dto';
import { JenisService } from 'src/jenis/jenis.service';

@Injectable()
export class TransaksiService {
    private readonly logger = new Logger(TransaksiService.name);
    
    constructor(
        @InjectRepository(TransaksiEntity) private transaksiRepo:Repository<TransaksiEntity>,
        private jenisService:JenisService
    ){}

    public async createPemasukan(data:CreateTransaksiDTO)
    {
            let query = `CALL createPemasukan('${data.jenisID}', '${data.nomorKas}', '${data.tanggal}', '${data.namaPenanggungJawab}', '${data.jumlah}', '${data.judul}', '${data.imageUrl}', '${data.keterangan}')`;
            this.logger.log(query)
            const res = await this.transaksiRepo.query(query);
            if(res) return true;
    }

    public async createPengeluaran(data:CreateTransaksiDTO)
    {
        let query = `CALL createPengeluaran('${data.jenisID}', '${data.nomorKas}', '${data.tanggal}', '${data.namaPenanggungJawab}', '${data.jumlah}', '${data.judul}', '${data.imageUrl}', '${data.keterangan}')`;
        const res = await this.transaksiRepo.query(query);
        if(res)
            return true;
    }

    public async getLatest():Promise<TransaksiEntity>
    {
        const latestData = await this.transaksiRepo.createQueryBuilder("transaksi").where("transaksi.isDeleted = :isDeleted", {isDeleted:0}).orderBy("transaksi.ID", "DESC").limit(1).getOne();
        return latestData;
    }

    public async create(data:CreateTransaksiDTO, refID:number, successCallback:(transaksiID:number)=>void)
    {
        const latestTransaksi = await this.getLatest();
        
        const jenis = await this.jenisService.findById(data.jenisID);

        let newSaldoSekarang= latestTransaksi.saldoSekarang;

        if(jenis.tipe == 'I') 
            newSaldoSekarang = latestTransaksi.saldoSekarang + data.jumlah 
        else if(jenis.tipe == 'O') 
            newSaldoSekarang = latestTransaksi.saldoSekarang - data.jumlah;

        const newTransaksi:TransaksiEntity = {
            ID:null,
            refID:refID,
            nomorKas:data.nomorKas,
            tanggal:data.tanggal,
            saldoSebelum:latestTransaksi.saldoSekarang,
            saldoSekarang:newSaldoSekarang,
            total:data.jumlah,
            transaksiLinkID:latestTransaksi.ID,
            isDeleted:0
        }

        const res = await this.transaksiRepo.save(newTransaksi);
        
        successCallback(res.ID);
    }
}
