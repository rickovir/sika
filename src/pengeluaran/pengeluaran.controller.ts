import { Controller, UseGuards, Get, Param, Post, Body, Query, Response, HttpStatus, HttpException, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PengeluaranService } from './pengeluaran.service';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateAssignedPengeluaranDTO, PengeluaranDTO } from './pengeluaran.dto';
import { PageQueryDTO } from 'src/shared/master.dto';
import { TransaksiService } from 'src/transaksi/transaksi.service';

@ApiBearerAuth()
@ApiTags('Pengeluaran')
@Controller('pengeluaran')
export class PengeluaranController {
    constructor(private pengeluaranService:PengeluaranService, private transaksiService:TransaksiService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('')
    public async showAll(@Response() res, @Query() pageQuery:PageQueryDTO)
    {
        try{
            const query = await this.pengeluaranService.findAll(pageQuery);
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    public async getById(@Response() res, @Param('id') ID:number){        
        try{
            const query = await this.pengeluaranService.findById(ID);
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('CreateAssigned')
    @ApiBody({type:CreateAssignedPengeluaranDTO})
    public async createAssignedPengeluaran(@Response() res, @Body() data:CreateAssignedPengeluaranDTO)
    {
        try{
            const query = await this.transaksiService.createPengeluaran(data);
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Post('createAsDraft')
    @ApiBody({type:PengeluaranDTO})
    public async createAsDraft(@Response() res, @Body() data:PengeluaranDTO)
    {        
        try{
            const query = await this.pengeluaranService.createAsDraft(data);
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('assignDraft/:id')
    public async assignPengeluaran(@Response() res, @Param('id') ID:number){
        try{
            const query = await this.pengeluaranService.assignPengeluaranDraft(ID);
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}
