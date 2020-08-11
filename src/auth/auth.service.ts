import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from 'src/users/users.dto';
import { RegistrationStatus } from './interfaces/registrationStatus.interface';
import { UserEntity } from 'src/users/users.entity';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserRefreshTokenDTO } from './login.dto';
import { TokenRO } from './login.ro';
import { tokenConfig } from 'src/shared/tokenConfig';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly usersService:UsersService){}

    async register(user:CreateUserDTO){
        let status:RegistrationStatus = {
            success:true,
            message:'user register'
        };

        try{
            await this.usersService.register(user);
        }
        catch(err)
        {
            status = {success:false, message:err};
        }

        return status;
    }    

    createToken(user:UserEntity)
    {
        const dataToken = {
            ID:user.ID,
            nama:user.nama,
            username:user.username,
        };
        const accessToken = jwt.sign(
            dataToken,
            tokenConfig.secret,
            { expiresIn:tokenConfig.tokenLife }
        );
        
        const refreshToken = jwt.sign(
            dataToken,
            tokenConfig.refreshTokenSecret,
            {expiresIn:tokenConfig.refreshTokenLife}
        );

        const response:TokenRO = {
            accessToken,
            refreshToken
        };
        this.usersService.updateRefreshToken(user.ID, {refreshToken, refreshTokenExpires:tokenConfig.refreshTokenLife});       
        
        return response;
    }

    async renewToken(userToken:UserRefreshTokenDTO)
    {
        const user = await this.usersService.findByRefreshToken(userToken.refreshToken);

        if(user)
        {
            const token = jwt.verify(userToken.refreshToken, tokenConfig.refreshTokenSecret);
            if(token)
            {
                const dataToken = {
                    ID:user.ID,
                    nama:user.nama,
                    username:user.username,
                };
                const accessToken = jwt.sign(
                    dataToken,
                    tokenConfig.secret,
                    { expiresIn:tokenConfig.tokenLife }
                );
    
                const response:TokenRO = {
                    accessToken,
                    refreshToken:user.refreshToken
                };
                
                return response;
            }
            
        }
        return false;
    }

    async validateUserToken(payload:JwtPayload):Promise<UserEntity>
    {
        return await this.usersService.findById(payload.ID);
    }

    async validateUser(username:string, password:string)
    {
        const user = await this.usersService.findByUsername(username);

        if(user && user.comparePassword(password))
        {
            this.logger.log('password check success');
            const {password, ...result} = user;

            return result;
        }

        return null;
    }
}
