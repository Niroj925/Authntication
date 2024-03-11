import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { time } from 'console';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) throw new UnauthorizedException();
    const decodeToken=jwt.decode(token);
     console.log('access token`s data:',decodeToken);

  
     if (isTokenExpire(decodeToken)) {
      console.log('Token expired');
      console.log('Cookies:', request.cookies);
      throw new UnauthorizedException('Token has expired');
  }


    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.AT_SECRET,
      });
      console.log('payload from guards:',payload);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  


}

const isTokenExpire=(decodedToken:any)=>{
    const now = Math.floor(Date.now() / 1000);

    return now>decodedToken.exp?true:false;
  }