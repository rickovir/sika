import { Controller, Post, Response, Body, HttpStatus, UseGuards, Query, Get, HttpException } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from 'src/users/users.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginCustomerDTO, UserRefreshTokenDTO } from './login.dto';

import * as bcrypt from 'bcryptjs';

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

    // @UseGuards(AuthGuard('local'))
    @Post('login')
    public async login(@Response() res, @Body() login:LoginCustomerDTO){
        try{
            const user = await this.authService.validateUser(login.username, login.password);
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
        catch(error)
        {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
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

    // @Post('hashtest')
    // public async hashTest(@Response() res, @Body() plain:LoginCustomerDTO){
    //     try{
    //         let hash = bcrypt.hashSync(plain.username, 5);

    //         return res.status(HttpStatus.OK).json(hash);
    //     }            
    //     catch(error)
    //     {
    //         throw new HttpException(error, HttpStatus.BAD_REQUEST);
    //     }

    // }

}
