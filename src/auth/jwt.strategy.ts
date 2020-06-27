import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    private readonly logger = new Logger(AuthService.name);
    constructor(private readonly authService:AuthService
    )
    {
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "SistemInformasiKasAnnawier"
        })
    }

    async validate(payload:any, done:Function)
    {
        const user = await this.authService.validateUserToken(payload)
        if(!user)
        {
            return done(new UnauthorizedException(), false);
        }

        done(null, user);
    }
}