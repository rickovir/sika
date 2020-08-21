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
import { PengeluaranDTO } from './pengeluaran.dto';

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

    public createAssignedPengeluaran(data:CreateTransaksiDTO):Promise<any | null>
    {
        return this.transaksiService.createPengeluaran(data);
    }

    public async assignPengeluaranDraft(ID:number)
    {
        const pengeluaran = await this.findById(ID);
        if(!pengeluaran.isDraft)  
        {
            throw new HttpException("Transaksi yang dapat diubah hanya transaksi jenis draft!", HttpStatus.BAD_REQUEST);
        }      
        this.transaksiService.create(<CreateTransaksiDTO>pengeluaran, ID, (transaksiID)=>{
            const res = this.update(ID, {transaksiID});
            return res;
        });
    }

    public async createAsDraft(data:PengeluaranDTO):Promise<any | null>
    {
        const jenis = await this.jenisService.findById(data.jenisID);
        const dataPemasukan = await this.pengeluaranRepo.create({...data, jenis:jenis});
        const res = await this.pengeluaranRepo.save(dataPemasukan);

        this.logger.log(dataPemasukan)

        if(res)
            return true;
    }

    private pengeluaranToRO(pengeluaran:PengeluaranEntity):PengeluaranRO
    {
        const responseObject:PengeluaranRO = {
            ...pengeluaran,
            jenisID:pengeluaran.jenis ? pengeluaran.jenis.ID : null
        }

        delete responseObject['jenis'];

        return responseObject;
    }

    public async destroy(ID:number)
    {
        const pengeluaranRow:PengeluaranRO = await this.findById(ID);
        if(pengeluaranRow.isDraft)
            await this.pengeluaranRepo.update(ID, {isDeleted:1});
        else
            throw new HttpException('Data yang dapat dihapus hanya draft', HttpStatus.BAD_REQUEST);
    }
}
