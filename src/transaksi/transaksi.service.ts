import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransaksiEntity } from './transaksi.entity';
import { Repository } from 'typeorm';
import { CreateTransaksiDTO } from './transaksi.dto';
import { JenisService } from 'src/jenis/jenis.service';
import { PageQueryDTO } from 'src/shared/master.dto';
import { IPagedQuery, IPagedResult } from 'src/shared/master.model';

@Injectable()
export class TransaksiService {
    private readonly logger = new Logger(TransaksiService.name);
    
    constructor(
        @InjectRepository(TransaksiEntity) private transaksiRepo:Repository<TransaksiEntity>,
        private jenisService:JenisService
    ){}

    public async findAll(pageQuery:PageQueryDTO):Promise<IPagedResult>
    {
        let offset:number = ((pageQuery.page-1)*pageQuery.itemsPerPage);
        let query:string = 
        `SELECT 
            transaksi.ID,
            transaksi.tanggal,
            transaksi.nomorKas AS 'nomorKas',
            IF(pemasukan.judul IS NOT NULL, pemasukan.judul, pengeluaran.judul) AS 'judulKas',
            pemasukan.jumlah AS debit,
            pengeluaran.jumlah AS kredit,
            transaksi.total AS 'arusKas'
        FROM 
            transaksi 
        LEFT JOIN 
            pemasukan 
        ON 
            pemasukan.transaksiID = transaksi.ID
        LEFT JOIN 
            pengeluaran 
        ON 
            pengeluaran.transaksiID = transaksi.ID
        WHERE 
            transaksi.isDeleted = 0
        ORDER BY 
            transaksi.ID
        DESC
        LIMIT ${offset}, ${pageQuery.itemsPerPage}`;

        const res = await this.transaksiRepo.query(query);

        return  <IPagedResult>{
            currentPage:pageQuery.page,
            totalRecords: res.length,
            data:res,
            resultPerPage:pageQuery.itemsPerPage
        };
    }

    public async showBalance(){
        let query:string = `
                SELECT 
                (SELECT SUM(transaksi.total) FROM transaksi WHERE transaksi.isDeleted = '0') AS 'totalSaldo',
                (SELECT SUM(pemasukan.jumlah) FROM pemasukan WHERE pemasukan.isDeleted = '0') AS 'totalDebit',
                (SELECT SUM(pengeluaran.jumlah) FROM pengeluaran WHERE pengeluaran.isDeleted = '0') AS 'totalCredit',
                CURDATE() AS 'date'`;
        const res:any[] = await this.transaksiRepo.query(query);
        return res[0];
    }

    public async getLatest():Promise<TransaksiEntity>
    {
        const latestData = await this.transaksiRepo.createQueryBuilder("transaksi").where("transaksi.isDeleted = :isDeleted", {isDeleted:0}).orderBy("transaksi.ID", "DESC").limit(1).getOne();
        return latestData;
    }

    public async create(data:CreateTransaksiDTO, refID:number)
    {
        const newTransaksi:TransaksiEntity = {
            ID:null,
            refID:refID,
            nomorKas:data.nomorKas,
            tanggal:data.tanggal,
            total:data.jumlah,
            isDeleted:0
        }

        const dataTransaksi = await this.transaksiRepo.create(newTransaksi);
        const resTransaksi = await this.transaksiRepo.save(dataTransaksi);

        return resTransaksi;
    }

    public async findById(ID:number)
    {
        const res = await this.transaksiRepo.findOneOrFail({ID});
        return res;
    }

    public async delete(refID:number)
    {
        await this.transaksiRepo.update({refID}, {isDeleted:1});
    }
}
