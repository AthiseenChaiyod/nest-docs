import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

// ก็จริงอยู่ที่โดยส่วนมากแล้ว HttpException() กับพวก built-in Exception() ก็เพียงพอต่อการใช้งานแล้ว
// แต่ว่าบางครั้ง ในฐานะ Dev เราก็อยากที่จะเขียน Error Handling ทีเดียวแล้วใช้ทั้งโปรแกรมก็มี
// หรืออยากจะ handle error แต่ละประเภท ถ้าเจอ error นี้ทำยังไง error นั้นทำยังไง
// เอาง่าย ๆ ก็คือเขียนใหม่ทั้งหมดนั่นแหละ ไม่ได้ใช้ built-in
// เราสามารถทำได้เหมือนกัน โดยการสร้าง Exception Filter ขึ้นมา
// แปะ @Catch() เอาไว้บนหัวของ export class
// โดย @Catch() จะ Trigger โค้ดของ Exception Filter ทุกครั้งที่มี Error เกิดขึ้น
// โดยเราสามารถใส่ argument เข้าไปใน @Catch() ได้ มีให้เลือก 3 ตัว
// SyntaxError จะจับข้อผิดพลาดที่เกี่ยวกับ Syntax
// TypeError จะจับข้อผิดพลาดที่เกี่ยวกับ Type
// HttpException จะทำงานทุกครั้งที่เกิด HttpException ขึ้น
// โดยเราสามารถใส่หลายตัวได้ (คั่นด้วย ,)
// หรือถ้าปล่อย @Catch() ว่างไปเลย ก็แปลว่าเราจับ Error ทั้ง 3 ประเภทเลย
@Catch(HttpException)
// จากนั้นให้เรามา implements ExceptionFilter ให้กับ class ด้วย
// อีกเรื่องสำคัญคือการ extends Exception Filter อ่านได้ที่ exception-filters-chapter.inherit-filter.ts
export class ExceptionFiltersChapterFilter implements ExceptionFilter {
  // การ implements ExceptionFilter จะทำให้เราต้องใส่ catch() มาด้วยเสมอ
  // โดย catch() จะรับ argument 2 ตัว คือ exception และ host
  // exception จะเป็นข้อมูลของ error ที่เกิดขึ้น
  // ส่วน host จะเป็นข้อมูลของ Request / Response ที่ส่งมาหรือจะส่งกลับ
  // Exception Filter หลัก ๆ ก็จะใช้ข้อมูล 2 อย่างนี้เพื่อนำมาสร้าง error log แบบละเอียด
  catch(exception: HttpException, host: ArgumentsHost) {
    // อย่างแรกสุดที่เราจะต้องทำก็คือการที่เราต้องรู้ก่อนว่า Req, Res ที่เราทำงานด้วยนั้นคือประเภทอะไร
    // Http? Microservices? Websockets?
    // เราก็จะนำ host มา .switchTo...() เพื่อเปลี่ยนไปใช้ Protocol ที่เราเลือก
    // ถ้าเราใช้ Http ก็ .switchToHttp() ถ้าใช้ Microservices ก็ ToRpc() และ ToWs() สำหรับ Websockets
    // สาเหตุที่เราต้อง switch mode ก็เพราะว่าจะมีคำสั่ง extract ข้อมูลสำหรับ protocol นั้น ๆ ให้เลือกใช้
    // ถ้าเรา .switchToRpc() ทั้ง ๆ ที่ Req เราเป็น Http เราก็จะ extract ข้อมูลออกมาไม่ได้
    const rtx = host.switchToHttp();

    // ต่อมาก็ให้เราเตรียม extract ข้อมูลของ Request / Response โดยการสร้างตัวแปรรอก่อน
    // อย่าลืมด้วยว่าให้ใส่ generics type เป็น Request / Response ของ express
    // เพราะว่ามีคำสั่ง extract ข้อมูลให้ใช้เหมือนกัน
    // ถ้าไม่ระบุ type เราอยากได้อะไรก็ต้องไปหาทางทำเอาเอง ไม่มี built-in ให้
    const request = rtx.getRequest<Request>();
    const response = rtx.getResponse<Response>();

    // ต่อมาก็ให้เรา extract ข้อมูลที่อยากได้จาก exception ของเรา
    // ถ้าเราไม่ได้ใส่ type ให้กับ exception เราก็จะไม่มี method getStatus() ให้ใช้
    // พยายามใส่ type ให้กับ exception ด้วยเสมอ
    const status = exception.getStatus();

    // สุดท้าย เราได้ข้อมูลมาครบตามที่อยากได้แล้ว ก็ให้เราเขียน return error log ได้เลย
    // จะเขียนผ่าน response method chaining
    // ใส่ status ก่อนตามด้วย JSON object ที่จะเป็น error log ของเรา
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: 'Error',
      path: request.url,
    });
  }
}
