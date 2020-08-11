import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JenisEntity } from './jenis.entity';
import { Repository, FindManyOptions, Like } from 'typeorm';
import { JenisDTO } from './jenis.dto';
import { JenisRO } from './jenis.ro';
import { clearResult } from 'src/shared/helper';
import { clear } from 'console';
import { IPagedResult } from 'src/shared/master.model';
import { PageQueryDTO } from 'src/shared/master.dto';

@Injectable()
export class JenisService {
    private readonly logger = new Logger(JenisService.name);
    constructor(
        @InjectRepository(JenisEntity)
        private jenisRepo:Repository<JenisEntity>
    ){

    }

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
        query.search = query.search ? query.search : '';
        const option:FindManyOptions = {
            ...this.querySelection(),
            take:query.itemsPerPage,
            skip:((query.page-1)*query.itemsPerPage),
            where:[
                { nama:Like(`%${query.search}%`) }
            ],
            order:{
                ID:query.order == 1 ? 'ASC' :'DESC'
            }
        };
        const [result, total] = await this.jenisRepo.findAndCount(option);
        const data = result.map(x=>clearResult(x));
        
        return  <IPagedResult>{
            currentPage:query.page,
            totalRecords: total,
            data:data,
            resultPerPage:query.itemsPerPage
        };
    }

    public async findById(ID:number) : Promise<JenisRO | null>{
        const res = <JenisRO>clearResult( await this.jenisRepo.findOneOrFail(this.querySelection({ID})));
        return res;
    }

    public async create(data:JenisDTO)
    {
        const jenis = await this.jenisRepo.save(data);
        if(jenis)
            return true;
        else return false;
    }

    public async update(ID:number, data:Partial<JenisDTO>)
    {
        const res = await this.jenisRepo.update(ID, data);
    }  

    public async destroy(ID:number)
    {
        const res = await this.jenisRepo.update(ID, {isDeleted:1});
        if(res)
            return true;
        else return false;
    }
}
