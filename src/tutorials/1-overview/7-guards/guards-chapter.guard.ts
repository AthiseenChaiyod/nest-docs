import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from './guards-chapter.reflector';

// เราได้เจอกับ Middleware ที่จะทำหน้าที่กรอง req ก่อนเข้าและกรอง res ก่อนออกไปแล้ว
// Guard ก็ทำหน้าที่คล้าย ๆ กับ Middleware นี่แหละ แต่จะสนแค่ว่าให้ทำได้หรือไม่ได้
// ไม่มีการแก้ไข ปรับเปลี่ยน req / res อะไรทั้งนั้น แค่จะเช็คว่าได้หรือไม่ได้
// และจะส่งค่า boolean กลับไปอย่างเดียว ไม่ส่งอย่างอื่น
// อารมณ์ประมาณการกรองชั้นที่สองต่อจาก Middleware ส่วนมากจะเอาไว้กรองอย่างละเอียดมากกว่า
// เช่น คุณเป็นพนักงานบริษัทนี้ไหม (middleware) ถ้าใช่ คุณจะเข้าห้องนี้คุณเป็น Manager รึเปล่า (Guard)
// จริงอยู่ที่ Middleware ก็ทำได้ในสิ่งที่ Guard ทำได้
// แต่ว่าการเขียน Middleware มาแทนที่ Guard จะทำให้โค้ดเราผิดหลักการ SOLID
// เพราะ Middleware เราจะทำหน้าที่หลายอย่างเกินไป จะทำให้โค้ด maintain ยาก
// อีกข้อสำคัญคือ Guard สามารถเข้าถึง ExecutionContext ได้ แต่ Middleware ไม่ได้
// ซึ่ง ExecutionContext ก็คือ class ที่ extends มาจาก ArgumentsHost ของ Middleware อีกที
// ข้างใน ExecutionContext จะมี getClass, getHandler ให้เราใช้ ซึ่ง ArgumentsHost ไม่มี
// ทำให้ Guard สามารถเข้าถึง class / handler ตัวต่อไปที่จะทำงานได้
// สร้าง Guard ได้ด้วยการแปะ @Injectable() เอาไว้กับ export class ที่ implements CanActivate()
// ส่วนการใช้งาน Guard ให้ไปอ่านต่อที่ guards-chapter.controller.ts
@Injectable()
export class GuardsChapterGuard implements CanActivate {
  // inject Reflector มาเพื่อใช้ extract ข้อมูล อ่านต่อได้ที่ body ของ canActivate()
  constructor(private reflector: Reflector) {}

  // การ implements CanActivate() จะทำให้เราต้องประกาศ canActivate() เสมอ
  // canActivate() จะรับค่า argument 1 ตัว นั่นก็คือ name: ExecutionContext
  // เราจะใช้ ExecutionContext ในการเข้าถึง method getClass(), getHandler()
  // หากเราลอง log ค่า .getClass() / .getHandler() ออกมาดู
  // เมื่อเราเรียกใช้โปรแกรมส่วนที่มี @UseGuards() ที่มีการ log .getClass() / .getHandler() ออกมาดู
  // เราจะได้ชื่อของ Class นั้นที่เราสร้างเอาไว้ตรง export class กลับมาเป็น []
  // และเราจะได้ชื่อของ method ที่เราเรียกใช้กลับมาเป็น [] เหมือนกัน
  // เช่น ไปแปะ @UseGuard(...) เอาไว้ที่ @CatsController() ที่มี @Get() getIndex() {...}
  // เราจะได้ [class CatsController], [Function: getIndex] กลับมา
  // โดยทั่วไป Guard จะส่งกลับแค่ค่า boolean เท่านั้น (สนแค่ว่าทำได้หรือไม่ได้)
  // ส่วนโค้ดการ check condition ก็จะเขียนข้างใน body ของ canActivate()
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // ในการใช้ Guard ให้มีประสิทธิภาพสูงที่สุดเราก็ต้องใช้คู่กับ Custom Decorator ด้วย
    // เพราะเราสามารถ extract เอาข้อมูลจาก Custom Decorator ได้ด้วย reflector.get<T>()
    // แต่ว่าเราจะไปพูดถึงการสร้าง Custom Decorator อีกทีที่บทถัด ๆ ไป ตอนนี้ให้รู้แค่วิธี extract ก็พอ
    // เราสามารถ extract ได้โดยใช้คำสั่ง reflector.get<T>() ดังนั้นเราจะต้อง inject เข้ามาก่อน
    // จากนั้นก็ให้เราเอาค่าไปใส่ตัวแปรที่เราสร้างรอเอาไว้ แต่ว่า get() จะต้องการ argument 2 ตัว
    // ตัวแรกคือ key ของ Decorator ตัวที่เราจะ extract (หลัง @ ก่อน ())
    // เช่น @Roles() ถ้าเราจะนำไปใส่เป็น argument ก็ให้ใช้ .get(Roles, ...)
    // ส่วนอีกตัวคือ scope ที่เราจะไป extract เอา Roles มา
    // โดยทั่วไปแล้ว Decorator จะต้องใส่ค่ามาด้วย (ถ้าเอามาใช้กับ Guard)
    // เช่น @Roles('admin') หรือ @Gender(['female'])
    // ดังนั้น การที่เราใส่ scope ไปเป็น argument ตัวที่สอง ก็หมายถึง เราจะ extract อะไร ที่ไหน
    // เช่น .get(Department, context.getHandler())
    // แปลว่าเราจะ extract เอาค่าของ @Department() ที่ method ของ ExecutionHandler
    // หรือก็คือ เราจะ extract ค่าของ @Department() จาก method ที่เราแปะ Guard เอาไว้
    // การสร้าง Custom Decorator พื้นฐานและการ extract ข้อมูล ดูได้ที่ guards-chapter.controller.ts
    console.log(this.reflector.get(Roles, context.getHandler()));

    // ส่งค่า false กลับไปถ้าหากจะ deny request
    return false;
  }
}
