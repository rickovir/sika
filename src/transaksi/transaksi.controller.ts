import { Controller, UseGuards, Get, Response, HttpStatus, HttpException, Query } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { clearResult } from 'src/shared/helper';
import { PageQueryDTO } from 'src/shared/master.dto';

@ApiBearerAuth()
@ApiTags('Transaksi')
@Controller('transaksi')
export class TransaksiController {
    constructor(private transaksiService:TransaksiService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    public async showAll(@Response() res, @Query() queryParams:PageQueryDTO)
    {
        const query = await this.transaksiService.findAll(queryParams);
        if(!query)
            res.status(HttpStatus.BAD_GATEWAY);
        else
            res.status(HttpStatus.OK).json(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('showBalance')
    public async showBalance(@Response() res)
    {
        try{
            const query = clearResult(await this.transaksiService.showBalance());
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}
