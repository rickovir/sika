import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDate, IsNumber, IsBoolean } from "class-validator";
import { CreateTransaksiDTO } from "src/transaksi/transaksi.dto";

export class PemasukanDTO{
    @ApiProperty()
    @IsString()
    nomorKas:string;

    @ApiProperty()
    @IsDate()
    tanggal:Date;
    
    @ApiProperty()
    @IsString()
    namaPenanggungJawab:string;
    
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
    @IsNumber()
    jumlah:number;
    
    @ApiProperty()
    @IsNumber()
    jenisID:number;
}

export class CreatePemasukanDTO extends CreateTransaksiDTO{
    constructor(){
        super();
    }
}

export class UpdatePemasukanDTO extends CreateTransaksiDTO{
    @ApiProperty()
    @IsNumber()
    transaksiID:number;

    constructor(){
        super();
    }
    
}