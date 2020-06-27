import { ApiProperty } from "@nestjs/swagger";

export class LoginCustomerDTO{
    @ApiProperty()
    readonly username:string;

    @ApiProperty()
    readonly password:string;
}