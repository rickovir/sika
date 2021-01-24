import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { PageQueryDTO } from "src/shared/master.dto";

export class JenisDTO{
    @ApiProperty()
    @IsString()
    nama:string;

    @ApiProperty()
    @IsString()
    tipe:string;
}

export class JenisPageQueryDTO extends PageQueryDTO{
    @ApiProperty({required:false})
    @IsString()
    tipe:string;

    constructor()
    {
        super();
    }
}