import { Injectable, NestMiddleware } from '@nestjs/common';
import { error } from 'console';
import { NextFunction, Request, Response } from 'express';

// บางครั้งเราก็ไม่ได้ต้องการให้ Client ทุกคนส่ง Request มาหาเราได้ตลอด
// เราอาจจะอยากกั้นให้เฉพาะ VIP หรือ Admin เข้ามาดูได้เท่านั้น
// Middleware มีไว้เพื่อการนั้น
// เราสามารถแก้ไข Request / Response ก่อนที่จะส่งไปให้ Controller / Client ได้
// แปลว่า Middleware จะทำงานก่อน Request เข้าและก่อน Response ออก
// แม้ว่า Middleware จะใช้แก้ไข Header ของ Response ได้เหมือนกับ @Header() แต่จุดประสงค์ต่างกัน
// @Header() ใช้ได้ง่ายกว่า ประกาศได้ในระดับ routing แต่ว่า Middleware ต้องมาเขียนแยกเอง
// สรุปก็คืออยู่ที่ requirement มากกว่า ถ้าใช้เยอะ ใช้หลายที่ก็เขียน Middleware ไว้ดีกว่า
// ถ้าไม่ได้ใช้เยอะ ต้องแก้ไขเฉพาะจุด ก็เขียน @Header() ก็ได้
// วิธีสร้างก็ให้เราใช้ @Injectable() แปะเอาไว้บน export class ที่ implements NestMiddleware
@Injectable()
export class MiddlewareChapterMiddleware implements NestMiddleware {
  // injection สามารถใช้งานใน Middleware ได้
  constructor() {}

  // การ implements NestMiddleware จะบังคับให้เราต้องมี use() ในโค้ดด้วย
  // use() ก็คือการทำงานของ Middleware ของเรา อยากให้ทำอะไรเขียนในนี้ได้เลย
  // use() จะรับ arguments 3 ตัว คือ request, response, next
  // request: Resquest เป็น Request ของ express จะมี built-in การจัดการ Request ให้ใช้
  // response: Response เป็น Response ของ express ที่มี built-in ให้ใช้เหมือนกัน
  // next: NextFunction จะเอาไว้ส่งไม้ต่อให้กับ Middleware ตัวถัดไป
  // ถ้าเกิดเราส่ง error ไปใน next() จะเป็นการข้าม Middleware ทั้งหมดและ trigger Exception Filter แทน
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`something`);
    next();
  }
}

// ใด ๆ ก็ตาม Middleware ของเราไม่ได้มี property, method หรือ dependency อะไรเลย
// เราเลยสามารถนำมาเขียนเป็น function ก็ได้
// จะเรียกว่า Functional Middleware
// โดยให้เรานำ arguments ทุกตัวไปไว้ใน () ของ function
// และนำโค้ดใน use() มาเขียนไว้ใน body ของ function แทน
// ส่วนเรื่อง Global Middleware ให้เราใช้ .use() แล้วใส่ Middleware ใน () ของ use ได้เลย
// ตัวอย่างสามารถดูได้ใน main.ts
export function MiddlewareChapterFunctionalMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(`This is functional middleware...`);
  next();
}
