import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from 'src/users/users.dto';
import { RegistrationStatus } from './interfaces/registrationStatus.interface';
import { UserEntity } from 'src/users/users.entity';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './interfaces/jwt-payload.interface';

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
        const expiresIn = 3600;
        const accessToken = jwt.sign(
            {
                id:user.ID,
                nama:user.nama,
                username:user.username,
            },
            "SistemInformasiKasAnnawier",
            {expiresIn}
        );
    
        return {
            expiresIn,
            accessToken,
        };
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
