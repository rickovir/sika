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
            }
        }
    }

    public async findAll(query:PageQueryDTO):Promise<IPagedResult>
    {
        try{
            query.search = query.search ? query.search : '';
            const option:FindManyOptions = {
                ...this.querySelection(),
                take:query.itemsPerPage,
                skip:((query.page-1)*query.itemsPerPage),
                where:[
                    { namaPenanggungJawab:Like(`%${query.search}%`) },
                    { nomorKas:Like(`%${query.search}%`) },
                    { keterangan:Like(`%${query.search}%`) },
                    { jumlah:Like(`%${query.search}%`) },
                    { judul:Like(`%${query.search}%`) }
                ],
                order:{
                    ID:query.order == 1 ? 'ASC' :'DESC'
                }
            };
            const [result, total] = await this.pemasukanRepo.findAndCount(option);
            const data = result.map(x=>{
                const isDraft = x.transaksiID ? false : true;
                return clearResult({...x, ...{isDraft} });
            });
            
            return  <IPagedResult>{
                currentPage:query.page,
                totalRecords: total,
                data:data,
                resultPerPage:query.itemsPerPage
            };

        }
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    public async findById(ID:number) : Promise<PemasukanRO | null>{
        try{
            const pemasukan = await this.pemasukanRepo.findOneOrFail(this.querySelection({ID}));
            const isDraft = pemasukan.transaksiID ? false : true;

            const res = <PemasukanRO>clearResult({...pemasukan, ...{isDraft}});
            return res;
        }
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    public createAssignedPemasukan(data:CreateTransaksiDTO):Promise<any | null>
    {
        return this.transaksiService.createPemasukan(data);
    }

    public async createAsDraft(data:PemasukanDTO):Promise<any | null>
    {
        try{
            const jenis = await this.jenisService.findById(data.jenisID);
            const dataPemasukan = await this.pemasukanRepo.create({...data, jenis:jenis});
            const res = await this.pemasukanRepo.save(dataPemasukan);

            this.logger.log(dataPemasukan)

            if(res)
                return true;
        }
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    private pemasukanToRO(pemasukan:PemasukanEntity):PemasukanRO
    {
        const responseObject:PemasukanRO = {
            ...pemasukan,
            jenisID:pemasukan.jenis ? pemasukan.jenis.ID : null
        }

        return responseObject;
    }
}
