import { Controller, Post, Response, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from 'src/users/users.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginCustomerDTO } from './login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService,
        private readonly usersService:UsersService
    ){

    }

    @Post('register')
    public async register(@Response() res, @Body() usersDTO:CreateUserDTO)
    {
        const result = await this.authService.register(usersDTO);

        if(!result)
        {
            return res.status(HttpStatus.BAD_REQUEST).json(result);
        }

        return res.status(HttpStatus.OK).json(result);
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    public async login(@Response() res, @Body() login:LoginCustomerDTO){
        const user = await this.usersService.findByUsername(login.username);

        if(!user)
        {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:'user Not Found'
            });
        }
        else
        {
            const token = this.authService.createToken(user);
            return res.status(HttpStatus.OK).json(token);
        }
    }
}
