import { Controller, UseGuards, Get, Param, Post, Body, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PengeluaranService } from './pengeluaran.service';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateAssignedPengeluaranDTO } from './pengeluaran.dto';
import { PageQueryDTO } from 'src/shared/master.dto';

@ApiBearerAuth()
@ApiTags('Pengeluaran')
@Controller('pengeluaran')
export class PengeluaranController {
    constructor(private pengeluaranService:PengeluaranService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('')
    showAll(@Query() query:PageQueryDTO)
    {
        return this.pengeluaranService.findAll(query);
    }

    
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    getById(@Param('id') ID:number){
        return this.pengeluaranService.findById(ID);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('createAssigned')
    @ApiBody({type:CreateAssignedPengeluaranDTO})
    createAssignedPengeluaran(@Body() data:CreateAssignedPengeluaranDTO)
    {
        return this.pengeluaranService.createAssignedPengeluaran(data);
    }
}
