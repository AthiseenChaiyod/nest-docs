import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ให้เราประกาศใช้ Global Pipe บน app ของเราด้วย .useGlobalPipe() ก่อน
  // แล้วเราก็ค่อยสร้าง instance ValidationPipe ที่ config ให้ whitelist property ของเรา
  // เท่านี้ก็จะกรอง property ที่ไม่ได้ถูก class-validator ครอบไว้ออกทั้งหมดแล้ว
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3000);
}
bootstrap();
