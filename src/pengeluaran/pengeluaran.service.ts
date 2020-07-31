import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PengeluaranEntity } from './pengeluaran.entity';
import { Repository, FindManyOptions, Like } from 'typeorm';
import { PengeluaranRO } from './pengeluaran.ro';
import { clearResult } from 'src/shared/helper';
import { TransaksiService } from 'src/transaksi/transaksi.service';
import { CreateTransaksiDTO } from 'src/transaksi/transaksi.dto';
import { IPagedResult } from 'src/shared/master.model';
import { PageQueryDTO } from 'src/shared/master.dto';

@Injectable()
export class PengeluaranService {
    constructor(
        @InjectRepository(PengeluaranEntity) private pengeluaranRepo:Repository<PengeluaranEntity>,
        private transaksiService:TransaksiService
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
            const [result, total] = await this.pengeluaranRepo.findAndCount(option);
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

    public async findById(ID:number) : Promise<PengeluaranRO | null>{
        try{
            const pengeluaran = await this.pengeluaranRepo.findOneOrFail(this.querySelection({ID}));
            const isDraft = pengeluaran.transaksiID ? false : true;

            const res = <PengeluaranRO>clearResult({...pengeluaran, ...{isDraft}});
            return res;
        }
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    public createAssignedPengeluaran(data:CreateTransaksiDTO):Promise<any | null>
    {
        return this.transaksiService.createPengeluaran(data);
    }

    private pengeluaranToRO(pengeluaran:PengeluaranEntity):PengeluaranRO
    {
        const responseObject:PengeluaranRO = {
            ...pengeluaran,
            jenisID:pengeluaran.jenis ? pengeluaran.jenis.ID : null
        }

        return responseObject;
    }
}
