import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class JenisDTO{
    @ApiProperty()
    @IsString()
    nama:string;

    @ApiProperty()
    @IsString()
    tipe:string;
}