import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO{
    @ApiProperty()
    readonly nama:string;
    
    @ApiProperty()
    readonly username:string;
    
    @ApiProperty()
    readonly password:string;
}

export class UpdateRefreshTokenDTO{
    @ApiProperty()
    readonly refreshToken:string;

    @ApiProperty()
    readonly refreshTokenExpires:number;
}