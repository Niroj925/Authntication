import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/pg.config';
import { UserinfoModule } from './modules/userinfo/userinfo.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
     UserinfoModule,
     AuthModule
    ],
  controllers: [AppController],
  providers: [
    AppService,
  ]
    ,
})
export class AppModule {}
