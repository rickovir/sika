import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDate, IsNumber } from "class-validator";

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
    total:number;
    
    @ApiProperty()
    @IsNumber()
    jenisID:number;
}