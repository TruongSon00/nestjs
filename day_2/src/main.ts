import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import Connect from 'config/connect';
dotenv.config()


async function bootstrap() {
  Connect()
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
