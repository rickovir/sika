import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDate, IsNumber } from "class-validator";
import { PageQueryDTO } from "src/shared/master.dto";

export class CreateTransaksiDTO{
    @ApiProperty()
    @IsString()
    nomorKas:string;

    @ApiProperty()
    @IsDate()
    tanggal:Date;

    @ApiProperty()
    @IsString()
    judul:string;
    
    @ApiProperty()
    @IsString()
    imageUrl:string;
    
    @ApiProperty()
    @IsString()
    keterangan:string;
    
    @ApiProperty()
    @IsString()
    namaPenanggungJawab:string;
    
    @ApiProperty()
    @IsNumber()
    jumlah:number;
    
    @ApiProperty()
    @IsNumber()
    jenisID:number;
}

export class TransaksiPageQueryDTO extends PageQueryDTO{
    @ApiProperty({required:false})
    @IsString()
    dateRange:string[];

    constructor()
    {
        super();
    }
}