import { Controller, 
        UseGuards, 
        Get, 
        Param, 
        Post, 
        Body, 
        Query, 
        Response, 
        HttpStatus, 
        HttpException, 
        Put, 
        UseInterceptors, 
        UploadedFile, 
        Res, 
        Delete
    } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PemasukanService } from './pemasukan.service';
import { ApiBearerAuth, ApiTags, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreatePemasukanDTO, PemasukanDTO } from './pemasukan.dto';
import { PageQueryDTO } from 'src/shared/master.dto';
import { TransaksiService } from 'src/transaksi/transaksi.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/shared/helper';

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
    @Post('')
    @ApiBody({type:CreatePemasukanDTO})
    public async create(@Response() res, @Body() data:CreatePemasukanDTO)
    {
        try{
            const query = await this.pemasukanService.create(data);
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    @ApiBody({type:CreatePemasukanDTO})
    public async update(@Response() res, @Body() data:CreatePemasukanDTO, @Param('id') ID:number)
    {
        try{
            const query = await this.pemasukanService.update(ID, data);
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
        
    @UseGuards(AuthGuard('jwt'))
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('image', {
            storage : diskStorage({
                destination : './uploads/pemasukan',
                filename : editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    public async uploadedFile(@UploadedFile() file)
    {
        const response = {
            filename: file.filename,
        };
        return response;
    }

    // @UseGuards(AuthGuard('jwt'))
    // @Get('image/:imgpath')
    // public async seeUploadedFile(@Res() res, @Param('imgpath') image:string) {
    //     return res.sendFile(image, { root: './uploads/pemasukan' });
    // }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    public async delPemasukan(@Response() res, @Param('id') ID:number)
    {
        try{
            const query = await this.pemasukanService.destroy(ID);
            res.status(HttpStatus.OK).json(query);
        }            
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}
