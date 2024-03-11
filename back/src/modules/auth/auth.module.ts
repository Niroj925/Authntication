import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { Auth } from "./entities/auth.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AtStrategy, RtStrategy } from "src/helper/middlewares/auth/strategy";
import { RefreshToken } from "./entities/refresh.entity";

@Module({
    imports:[ TypeOrmModule.forFeature([
       Auth,
       RefreshToken
    ]),   
     JwtModule.register({})
    ],
    controllers:[AuthController],
    providers:[AuthService,AtStrategy,RtStrategy],
    exports: [AuthService], 
})

export class AuthModule{}  ;  