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
    @IsString()
    refreshToken:string;
}