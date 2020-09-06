import { Controller, Post, Response, Body, HttpStatus, UseGuards, Query, Get } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from 'src/users/users.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginCustomerDTO, UserRefreshTokenDTO } from './login.dto';

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
            res.status(HttpStatus.BAD_REQUEST).json({
                message:'user Not Found'
            });
        }
        else
        {
            const token = this.authService.createToken(user);
            return res.status(HttpStatus.OK).json(token);
        }
    }

    @Get('generateToken')
    public async generateToken(@Response() res, @Query() data:UserRefreshTokenDTO)
    {
        const token = await this.authService.renewToken(data);

        if(!token)
        {
            res.status(HttpStatus.BAD_REQUEST).json({
                message:'Token Wrong !'
            });
        }
        else
        {
            return res.status(HttpStatus.OK).json(token);
        }
    }

}
