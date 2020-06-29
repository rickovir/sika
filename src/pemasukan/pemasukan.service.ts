import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PemasukanEntity } from './pemasukan.entity';
import { Repository } from 'typeorm';
import { PemasukanRO } from './pemasukan.ro';
import { clearResult } from 'src/shared/helper';
import { TransaksiService } from 'src/transaksi/transaksi.service';
import { CreateTransaksiDTO } from 'src/transaksi/transaksi.dto';

@Injectable()
export class PemasukanService {
    constructor(
        @InjectRepository(PemasukanEntity) private pemasukanRepo:Repository<PemasukanEntity>,
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

    public async findAll():Promise<PemasukanRO[]>
    {
        try{
            const jenis = await this.pemasukanRepo.find(this.querySelection());
            const res = jenis.map(x=>clearResult(x));
            return res;
        }
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    public async findById(ID:number) : Promise<PemasukanRO | null>{
        try{
            const res = <PemasukanRO>clearResult( await this.pemasukanRepo.findOneOrFail(this.querySelection({ID})));
            return res;
        }
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    public createAssignedPemasukan(data:CreateTransaksiDTO):Promise<any | null>
    {
        return this.transaksiService.createPemasukan(data[0]);
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
