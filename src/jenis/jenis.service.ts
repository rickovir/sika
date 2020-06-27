import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JenisEntity } from './jenis.entity';
import { Repository } from 'typeorm';
import { JenisDTO } from './jenis.dto';
import { JenisRO } from './jenis.ro';
import { clearResult } from 'src/shared/helper';
import { clear } from 'console';

@Injectable()
export class JenisService {
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

    public async findAll():Promise<JenisRO[]>
    {
        const jenis = await this.jenisRepo.find(this.querySelection());
        const res = jenis.map(x=>clearResult(x));
        return res;
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
        if(res)
            return true;
        else return false;
    }  

    public async destroy(ID:number)
    {
        const res = await this.jenisRepo.update(ID, {isDeleted:1});
        if(res)
            return true;
        else return false;
    }
}
