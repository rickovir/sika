import { Controller, UseGuards, Get, Response, HttpStatus, HttpException } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { clearResult } from 'src/shared/helper';

@ApiBearerAuth()
@ApiTags('Transaksi')
@Controller('transaksi')
export class TransaksiController {
    constructor(private transaksiService:TransaksiService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('showBalance')
    public async showAll(@Response() res)
    {
        try{
            const query = clearResult(await this.transaksiService.getLatest());
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}
