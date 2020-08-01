import { Controller, UseGuards, Get, Param, Post, Body, Query, Response, HttpStatus, HttpException, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PemasukanService } from './pemasukan.service';
import { ApiBearerAuth, ApiTags, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateAssignedPemasukanDTO, PemasukanDTO } from './pemasukan.dto';
import { PageQueryDTO } from 'src/shared/master.dto';
import { TransaksiService } from 'src/transaksi/transaksi.service';

@ApiBearerAuth()
@ApiTags('Pemasukan')
@Controller('pemasukan')
export class PemasukanController {
    constructor(private pemasukanService:PemasukanService, private transaksiService:TransaksiService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('')
    async showAll(@Response() res, @Query() pageQuery:PageQueryDTO)
    {
        try{
            const query = await this.pemasukanService.findAll(pageQuery);
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
            const query = await this.pemasukanService.findById(ID);
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('createAssigned')
    @ApiBody({type:CreateAssignedPemasukanDTO})
    public async createAssignedPemasukan(@Response() res, @Body() data:CreateAssignedPemasukanDTO)
    {
        try{
            const query = await this.transaksiService.createPemasukan(data);
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Post('createAsDraft')
    @ApiBody({type:PemasukanDTO})
    public async createAsDraft(@Response() res, @Body() data:PemasukanDTO)
    {        
        try{
            const query = await this.pemasukanService.createAsDraft(data);
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('assignDraft/:id')
    public async assignPemasukan(@Response() res, @Param('id') ID:number){
        try{
            const query = await this.pemasukanService.assignPemasukanDraft(ID);
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}
