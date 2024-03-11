import { Controller, Post,Req ,Body, ParseIntPipe, HttpCode, HttpStatus, UseGuards, Request, Res, Get} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { SkipThrottle,Throttle } from "@nestjs/throttler";
// import { RtGuard } from "src/helper/middlewares/auth/guard";
import { Response } from "express";
import { Jwt } from "jsonwebtoken";
import { JwtGuard } from "src/helper/middlewares/auth/guards/jwt.guard";
import { RtGuard } from "src/helper/middlewares/auth/guard";

@SkipThrottle()
@Controller('auth') 

export class AuthController{
    constructor(private authService:AuthService){}
       
        @HttpCode(HttpStatus.OK)//return sc 200
        @Post('signup')
        signup( @Body() dto:CreateAuthDto ){ 
            return this.authService.signUp(dto);
        }
         
        @SkipThrottle({default:false})
        @Throttle({default:{limit:5,ttl:60000}})
        @HttpCode(HttpStatus.OK)//return sc 201
        @Post('signin')
        signin(@Res({ passthrough: true }) response: Response, @Body() dto:CreateAuthDto ){
            // response.cookie('accessToken',"this is access token")
            return this.authService.signIn(response,dto);
        }

        @Get('token')
        async login(@Req() req:any) {
         console.log(req.cookies)
          return {};
        }

        @UseGuards(JwtGuard)
        @Get('users')
        async getUsers(@Req() req:any) {
            console.log('cookie:',req.cookies)
            const user=req.user;
            console.log(user);
            //  return {success:true};
            return this.authService.getUser(user.sub);
           }

        @Post('logout')
        async logout(@Res({ passthrough: true }) response: any) {
            response.cookie('refresh_token', '', { expires: new Date(0) });
            response.cookie('access_token', '', { expires: new Date(0) });
            // Set the cookie's expiration date in the past
            return {success:true}; // Return an empty response or any other response data
        }
        
        @SkipThrottle({default:false})
        @Post('refresh')
        async refrshToken(@Req() req:any) {
            // const cookie=req.cookies
            // console.log('cookie:',req.cookies)
          return this.authService.refreshToken(req.cookies);
        }
}