import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Auth } from "src/modules/auth/entities/auth.entity";
import { Repository } from "typeorm";

@Injectable()
export class AtStrategy extends PassportStrategy(
    Strategy,
    'jwt_access',
){
    constructor(
        config:ConfigService,
        @InjectRepository(Auth)
        private readonly authRepository:Repository<Auth>
    ){
        super({
            jwtFromRequest:
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:config.get('AT_SECRET')
        })
    }

    async validate(payload: { sub: string, email: string,exp:number }) {
      
        console.log('Payload:', payload);
        const user = await this.authRepository.findOne({where:{email:payload.email}});
        console.log(user)
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        
        // Check if the token has expired
        const tokenExpiration = new Date(payload.exp* 1000); // Convert expiration timestamp to milliseconds
        const now = new Date();
        if (tokenExpiration <= now) {
            console.log('token has expired')
            // Token has expired
            throw new UnauthorizedException('Token has expired');
        }

        // If token is not expired, return user data
        return user;
    }
}