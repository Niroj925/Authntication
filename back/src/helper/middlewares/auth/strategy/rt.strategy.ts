import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/modules/auth/entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
    constructor(
        config:ConfigService,
        @InjectRepository(Auth)
        private readonly authRepository:Repository<Auth>
    ){
        super({
            jwtFromRequest:
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:config.get('RT_SECRET')
        })
    }
    async validate(payload:{
        sub:string,
        email:string
    }){
        // console.log({
        //     payload,
        // });
        const user=await this.authRepository.find({
            where:{
                id:payload.sub
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // delete user.hash;
        return user;
    }

}