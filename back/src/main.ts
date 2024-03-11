import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import fastifyCookie from '@fastify/cookie';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
//   const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
// await app.register(fastifyCookie, {
//   secret: 'my-secret', // for cookies signature
// });


  app.enableCors({
    origin:[
      'http://localhost:3000'
    ],
    credentials:true
  });
  app.use(cookieParser());
  
  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    whitelist:true
  }))

  app.setGlobalPrefix('/api/v1');
  await app.listen(4040);
  console.log('server is running port 4040')
}
bootstrap();
