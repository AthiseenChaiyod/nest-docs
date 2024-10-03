import { ContextIdFactory, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DurableProvider } from './tutorials/2-fundamentals/4-injection-scopes/injection-scopes-chapter.durable-provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ให้เราประกาศใช้ Global Pipe บน app ของเราด้วย .useGlobalPipe() ก่อน
  // แล้วเราก็ค่อยสร้าง instance ValidationPipe ที่ config ให้ whitelist property ของเรา
  // เท่านี้ก็จะกรอง property ที่ไม่ได้ถูก class-validator ครอบไว้ออกทั้งหมดแล้ว
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // นำ Middleware ที่จะใช้แบบ Global ประกาศตรงนี้ได้เลย
  // app.use();

  // ในการประกาศ Exception Filter แบบ Global เราจะต้องใช้ .useGlobalFilters() บน app
  // แต่ประเด็นสำคัญอยู่ที่ ถ้าเราประกาศ Global ตรงนี้ Filter จะอยู่นอก injection context
  // ทำให้เราไม่สามารถ inject อะไรเข้าไปตอนสร้าง filter instance ได้
  // ถ้าเรามี inject ใน filter ก็จะเกิดข้อผิดพลาดได้
  // ดังนั้นให้เราไปประกาศ custom providers เอาไว้ใน Root Module ด้วย (ทั่วไปก็ AppModule)
  // หน้าตาของ custom providers คือ { provide: APP_FILTER, useClass: FilterName }
  // จะทำให้เราสามารถ inject dependency เข้ามาใน Exception Filter ได้ก่อนที่จะนำไปใช้งาน
  // app.useGlobalFilters(FILTER_CLASS_HERE)

  // บรรทัดนี้จะแสดงผลเป็น Global อยู่แล้ว จะเขียนไว้ที่ไหนก็ได้ แต่เขียนไว้ใน main.ts เป็นระเบียบสุด
  // โค้ดนี้จะช่วยให้ durable ของเราทำงานได้ปกติ
  ContextIdFactory.apply(new DurableProvider());

  await app.listen(3000);
}
bootstrap();
