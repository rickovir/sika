import { ApiProperty, ApiQuery } from "@nestjs/swagger";
import { IsNumber, IsString, IsOptional } from "class-validator";
import { IPagedQuery, ISortable } from "./master.model";

export class PageQueryDTO implements IPagedQuery, ISortable{
    @ApiProperty()
    @IsNumber()
    page:number;

    @ApiProperty()
    @IsNumber()
    itemsPerPage:number;

    @ApiProperty({required:false})
    @IsString()
    search:string;

    @ApiProperty({required:false})
    @IsString()
    field:string;
    
    @ApiProperty({required:false, default:1})
    @IsNumber()
    order:number;
}