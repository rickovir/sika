import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { isString } from "util";

export class LoginCustomerDTO{
    @ApiProperty()
    readonly username:string;

    @ApiProperty()
    readonly password:string;
}

export class UserRefreshTokenDTO{
    @ApiProperty()
    @IsNumber()
    ID:number;
    
    @ApiProperty()
    @IsString()
    nama:string;

    @ApiProperty()
    @IsString()
    username:string;

    @ApiProperty()
    @IsString()
    refreshToken:string;
}