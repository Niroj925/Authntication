
import { Module } from '@nestjs/common';
import { UserinfoService } from './userinfo.service';
import { UserinfoController } from './userinfo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Userinfo } from './entities/userinfo.entity';
import { Auth } from 'src/modules/auth/entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
// import { Auth } from '../auth/entities/auth.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Userinfo,Auth])],
  controllers: [UserinfoController],
  providers: [UserinfoService,JwtService],
})
export class UserinfoModule {}

