import { Controller, UseGuards, Get, Param, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PemasukanService } from './pemasukan.service';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateAssignedPemasukanDTO } from './pemasukan.dto';

@ApiBearerAuth()
@ApiTags('Pemasukan')
@Controller('pemasukan')
export class PemasukanController {
    constructor(private pemasukanService:PemasukanService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('')
    showAll()
    {
        return this.pemasukanService.findAll();
    }

    
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    getById(@Param('id') ID:number){
        return this.pemasukanService.findById(ID);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('createAssigned')
    @ApiBody({type:[CreateAssignedPemasukanDTO]})
    createAssignedPemasukan(@Body() data:CreateAssignedPemasukanDTO)
    {
        return this.pemasukanService.createAssignedPemasukan(data);
    }
}
