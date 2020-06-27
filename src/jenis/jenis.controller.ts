import { Controller, UseGuards, Get, Post, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { JenisService } from './jenis.service';
import { AuthGuard } from '@nestjs/passport';
import { JenisDTO } from './jenis.dto';

@ApiBearerAuth()
@ApiTags('Jenis')
@Controller('jenis')
export class JenisController {
    constructor(private jenisService:JenisService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    showAll()
    {
        return this.jenisService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    getJenisById(@Param('id') ID:number)
    {
        return this.jenisService.findById(ID);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('')
    @ApiBody({type:[JenisDTO]})
    postJenis(@Body() data:JenisDTO)
    {
        return this.jenisService.create(data);
    }
}
