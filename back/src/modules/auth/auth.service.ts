import {
  ForbiddenException,
  Injectable,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FindOperator, Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtPayload } from 'src/helper/types/token_types';
import { RefreshToken } from './entities/refresh.entity';
import * as jwt from 'jsonwebtoken';
import { response } from 'express';

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private jwtService: JwtService,
    private config: ConfigService,

    @InjectRepository(RefreshToken)
    private readonly tokenRepository: Repository<RefreshToken>,
  ) {}

  async signIn(@Res({ passthrough: true }) response: any, dto: CreateAuthDto) {
    try {
      const user = await this.authRepository.findOne({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new ForbiddenException('Invalid credentials');
      }
      const isCorrect = await argon.verify(user.password, dto.password);

      if (!isCorrect) {
        throw new ForbiddenException('Invalid credentials');
      }
      const { access_token, refresh_token } = await this.signTokens(
        user.id,
        user.email,
      );

      response.cookie('refresh_token', refresh_token, {
        expires: new Date(Date.now() + 30 * 24 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // sameSite: 'none',
        // secure:true
      });

      const token = await this.tokenRepository.findOne({ where: { user } });
      // console.log(token);

      if (token) {
        token.refreshtoken = refresh_token;
        await this.tokenRepository.save(token);
      } else {
        const data = {
          refreshtoken: refresh_token,
          user: user,
        };
        const token = this.tokenRepository.create(data);
        await this.tokenRepository.save(token);
      }

      return { access_token: access_token };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async refreshToken(token: any) {
    // console.log('cookie:', token);
    const { refresh_token } = token;
    const decodedToken:any = jwt.decode(refresh_token);

    const { sub, email } = decodedToken;

    const rt = await this.tokenRepository.findOne({
      where: { user: { id: sub } },
    });

    if(token.refresh_token===rt.refreshtoken){
    const payload = {
      sub,
      email
    };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '2m',
      secret: this.config.get<string>('AT_SECRET'),
    });

    return {
      access_token,
    };
    }else{
        throw new UnauthorizedException('invalid credentials.')
    }
  }

  async signUp(dto: CreateAuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const data = {
        email: dto.email,
        password: hash,
      };
      const user = this.authRepository.create(data);
      return this.authRepository.save(user);
    } catch (error) {
      throw new ForbiddenException('Credentials taken');
    }
  }

  //generate token
  async signTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '2m',
      secret: this.config.get<string>('AT_SECRET'),
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '10d',
      secret: this.config.get<string>('RT_SECRET'),
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async getUser(id: string) {
    try {
      const user = await this.authRepository.findOne({ where: { id } });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      jwt.verify(token, this.config.get<string>('RT_SECRET'), {
        ignoreExpiration: true,
      });
      return false; // Token is not expired
    } catch (error) {
      return true; // Token is expired
    }
  }
}
