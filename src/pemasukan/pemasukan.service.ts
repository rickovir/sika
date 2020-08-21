import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PemasukanEntity } from './pemasukan.entity';
import { Repository, FindManyOptions, Like } from 'typeorm';
import { PemasukanRO } from './pemasukan.ro';
import { clearResult } from 'src/shared/helper';
import { TransaksiService } from 'src/transaksi/transaksi.service';
import { CreateTransaksiDTO } from 'src/transaksi/transaksi.dto';
import { IPagedResult, IPagedQuery } from 'src/shared/master.model';
import { PageQueryDTO } from 'src/shared/master.dto';
import { PemasukanDTO } from './pemasukan.dto';
import { JenisService } from 'src/jenis/jenis.service';

@Injectable()
export class PemasukanService {
    private readonly logger = new Logger(PemasukanService.name);
    constructor(
        @InjectRepository(PemasukanEntity) private pemasukanRepo:Repository<PemasukanEntity>,
        private transaksiService:TransaksiService,
        private jenisService:JenisService,
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
                { isDeleted:0 },
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
        const [result, total] = await this.pemasukanRepo.findAndCount(option);
        const data = result.map(x=>{
            const isDraft = x.transaksiID ? false : true;
            return clearResult({...this.pemasukanToRO(x), ...{isDraft} });
        });
        
        return  <IPagedResult>{
            currentPage:query.page,
            totalRecords: total,
            data:data,
            resultPerPage:query.itemsPerPage
        };
    }

    public async findById(ID:number) : Promise<PemasukanRO | null>{
        const pemasukan = await this.pemasukanRepo.findOneOrFail(this.querySelection({ID}));
        const isDraft = pemasukan.transaksiID ? false : true;

        const res = <PemasukanRO>clearResult({...this.pemasukanToRO(pemasukan), ...{isDraft}});
        return res;
    }

    public createAssignedPemasukan(data:CreateTransaksiDTO):Promise<any | null>
    {
        return this.transaksiService.createPemasukan(data);
    }

    public async update(ID:number, data:Partial<PemasukanEntity>)
    {
        const res = await this.pemasukanRepo.update(ID, data);
        if(res)
            return true;
        else return false;
    } 

    public async createAsDraft(data:PemasukanDTO):Promise<any | null>
    {
        const jenis = await this.jenisService.findById(data.jenisID);
        const dataPemasukan = await this.pemasukanRepo.create({...data, jenis:jenis});
        const res = await this.pemasukanRepo.save(dataPemasukan);

        if(res)
            return true;
    }

    public async assignPemasukanDraft(ID:number)
    {
        const pemasukan = await this.findById(ID);
        if(!pemasukan.isDraft)
        {
            throw new HttpException("Transaksi yang dapat diubah hanya transaksi jenis draft!", HttpStatus.BAD_REQUEST);
        }
        // this.logger.log(pemasukan.jenisID)
        this.transaksiService.create(<CreateTransaksiDTO>pemasukan, ID, (transaksiID) => {
            const res = this.update(ID,{transaksiID});
            return res;
        });
    }

    private pemasukanToRO(pemasukan:PemasukanEntity):PemasukanRO
    {
        const responseObject:PemasukanRO = {
            ...pemasukan,
            jenisID:pemasukan.jenis ? pemasukan.jenis.ID : null
        }
        
        delete responseObject['jenis'];

        return responseObject;
    }

    public async destroy(ID:number)
    {
        const pemasukanRow:PemasukanRO = await this.findById(ID);
        if(pemasukanRow.isDraft)
            await this.pemasukanRepo.update(ID, {isDeleted:1});
        else
            throw new HttpException('Data yang dapat dihapus hanya draft', HttpStatus.BAD_REQUEST);
    }
}
