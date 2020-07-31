import { Controller, UseGuards, Get, Param, Post, Body, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PemasukanService } from './pemasukan.service';
import { ApiBearerAuth, ApiTags, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateAssignedPemasukanDTO, PemasukanDTO } from './pemasukan.dto';
import { IPagedResult, IPagedQuery } from 'src/shared/master.model';
import { PageQueryDTO } from 'src/shared/master.dto';

@ApiBearerAuth()
@ApiTags('Pemasukan')
@Controller('pemasukan')
export class PemasukanController {
    constructor(private pemasukanService:PemasukanService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('')
    showAll(@Query() query:PageQueryDTO)
    {
        return this.pemasukanService.findAll(query);
    }

    
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    getById(@Param('id') ID:number){
        return this.pemasukanService.findById(ID);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('createAssigned')
    @ApiBody({type:CreateAssignedPemasukanDTO})
    createAssignedPemasukan(@Body() data:CreateAssignedPemasukanDTO)
    {
        return this.pemasukanService.createAssignedPemasukan(data);
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Post('createAsDraft')
    @ApiBody({type:PemasukanDTO})
    createAsDraft(@Body() data:PemasukanDTO)
    {
        return this.pemasukanService.createAsDraft(data);
    }
}
