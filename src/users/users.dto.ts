import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO{
    @ApiProperty()
    readonly ID:number;
    
    @ApiProperty()
    readonly nama:string;
    
    @ApiProperty()
    readonly username:string;
    
    @ApiProperty()
    readonly password:string;
}