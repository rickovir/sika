import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PengeluaranEntity } from './pengeluaran.entity';
import { Repository, FindManyOptions, Like } from 'typeorm';
import { PengeluaranRO } from './pengeluaran.ro';
import { clearResult } from 'src/shared/helper';
import { TransaksiService } from 'src/transaksi/transaksi.service';
import { CreateTransaksiDTO } from 'src/transaksi/transaksi.dto';
import { IPagedResult } from 'src/shared/master.model';
import { PageQueryDTO } from 'src/shared/master.dto';
import { CreateTransaksiRO } from 'src/transaksi/transaksi.ro';
import { exception } from 'console';
import { JenisService } from 'src/jenis/jenis.service';
import { PengeluaranDTO, CreatePengeluaranDTO } from './pengeluaran.dto';

@Injectable()
export class PengeluaranService {
    private readonly logger = new Logger(PengeluaranService.name);
    constructor(
        @InjectRepository(PengeluaranEntity) private pengeluaranRepo:Repository<PengeluaranEntity>,
        private transaksiService:TransaksiService,
        private jenisService:JenisService
    ){}

    private querySelection(selection = null)
    {
        return {
            where:{
                ...selection,
                isDeleted:0
            },
            relations : ['jenis']
        }
    }

    public async findAll(query:PageQueryDTO):Promise<IPagedResult>
    {
        query.search = query.search ? query.search : '';
        const option:FindManyOptions = {
            take:query.itemsPerPage,
            skip:((query.page-1)*query.itemsPerPage),
            where:[
                { namaPenanggungJawab:Like(`%${query.search}%`), isDeleted:0 },
                { nomorKas:Like(`%${query.search}%`), isDeleted:0 },
                { keterangan:Like(`%${query.search}%`), isDeleted:0 },
                { jumlah:Like(`%${query.search}%`), isDeleted:0 },
                { judul:Like(`%${query.search}%`), isDeleted:0 }
            ],
            order:{
                ID:query.order == 1 ? 'ASC' :'DESC'
            },
            relations : ['jenis']
        };
        const [result, total] = await this.pengeluaranRepo.findAndCount(option);
        
        const data = result.map(x=>{
            const isDraft = x.transaksiID ? false : true;
            return clearResult({...this.pengeluaranToRO(x), ...{isDraft} });
        });
        
        return  <IPagedResult>{
            currentPage:query.page,
            totalRecords: total,
            data:data,
            resultPerPage:query.itemsPerPage
        };
    }

    public async findById(ID:number) : Promise<PengeluaranRO | null>{
        const pengeluaran = await this.pengeluaranRepo.findOneOrFail(this.querySelection({ID}));

        const isDraft = pengeluaran.transaksiID ? false : true;

        const res = <PengeluaranRO>clearResult({...this.pengeluaranToRO(pengeluaran), ...{isDraft}});
        return res;
    }

    public async update(ID:number, data:Partial<PengeluaranEntity>)
    {
        const res = await this.pengeluaranRepo.update(ID, data);
        if(res)
            return true;
        else return false;
    } 

    public async create(data:CreatePengeluaranDTO)
    {
        const jenis = await this.jenisService.findById(data.jenisID);

        const transaksiPengeluaran:CreatePengeluaranDTO = {...data, jumlah:data.jumlah*-1};

        const dataPengeluaran = await this.pengeluaranRepo.create({...transaksiPengeluaran, jenis:jenis});

        const pengeluaranID:number = (await this.pengeluaranRepo.save(dataPengeluaran)).ID;

        const transaksiID = (await this.transaksiService.create(transaksiPengeluaran, pengeluaranID)).ID;

        await this.pengeluaranRepo.update(pengeluaranID, {transaksiID});
    }

    private pengeluaranToRO(pengeluaran:PengeluaranEntity):PengeluaranRO
    {
        const responseObject:PengeluaranRO = {
            ...pengeluaran,
            jenisID:pengeluaran.jenis ? pengeluaran.jenis.ID : null,
            jenisNama:pengeluaran.jenis ? pengeluaran.jenis.nama : null,
        }

        delete responseObject['jenis'];

        return responseObject;
    }

    public async destroy(ID:number)
    {
        const pengeluaranRow:PengeluaranRO = await this.findById(ID);
        if(pengeluaranRow){
            await this.pengeluaranRepo.update(ID, {isDeleted:1});
            await this.transaksiService.delete(ID);
        }else
            throw new HttpException('Hanya Pengeluaran yang terdaftar saja yang dapat dihapus', HttpStatus.BAD_REQUEST);
    }
}
