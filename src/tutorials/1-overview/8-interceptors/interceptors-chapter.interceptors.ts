import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';

// Interceptor ก็จะทำหน้าที่คล้ายกับ Middleware นั่นก็คือ execute คำสั่งบางอย่างก่อนหลังส่ง req / res
// แล้วเราจะมี Interceptor เอาไว้ทำไม ถ้าเกิดเราสามารถใช้ Middleware ในการจัดการกับ req / res ได้
// สาเหตุก็เพราะ Middleware จะเอาไว้จัดการระดับ HTTP แต่ว่า Interceptor เอาไว้จัดการระดับ Framework
// กล่าวคือ Middleware ไม่สามารถเข้าถึงข้อมูลระดับ Framework ได้
// เช่น Method ที่จะทำงานคืออะไร (context.getHandler()), etc.
// ทำให้เราสามารถเขียนจัดการกับ Middleware ได้เพียงการตรวจสอบพื้นฐานเท่านั้น
// คิดภาพก็เหมือนกับโรงงานมันฝรั่งเหมือนเดิม แต่ครั้งนี้จะละเอียดมากกว่าที่อ่านใน Middleware
// ก่อนที่เราจะได้มันฝรั่งสดที่จะนำมาทำขนม เราก็ต้องกรองก่อน ว่ามันฝรั่งนี้มาจากสถานที่ ๆ ไว้ใจได้
// ไม่ใช่ว่าใครจะส่งมาให้เราก็ได้ ดังนั้น Middleware จะทำการกรองมันฝรั่งจาก supplier ที่น่าเชื่อถือก่อน
// จากนั้นมันฝรั่งที่เข้ามาในโรงงานเรียบร้อยแล้ว นี่แหละที่จะถูกแปลงโดย Interceptor
// เพราะว่าหน้าที่ Middleware คือแค่กรองภายนอกเท่านั้น ไม่มี Method ที่จะจัดการระดับ Framework
// สมมติว่าเราทำงาน 3 ขั้นตอน ปอกเปลือก -> หั่น -> ทอด
// อันดับแรกเลยคือเราสามารถรู้ได้ด้วยว่าเราจะทำงานที่ไหน ผ่าน .getHandler() ของ ExecutionContext
// หรือเราอยากแปลงมันฝรั่งเป็นเต๋าก่อนก็ทำได้ (แปลง Request เป็นรูปร่างที่เราอยากได้)
// ทุกอย่างจะทำใน Inceptor ทั้งสิ้น เพราะเป็นการเปลี่ยนแปลงระดับ Framework ที่ Middleware ทำไม่ได้
// เริ่มจากการแปะ @Injectable() เอาไว้กับ export class ที่ implements NestInterceptor ก่อน
// ส่วนการใช้งานสามารถอ่านได้ที่ interceptors-chapter.controller.ts
@Injectable()
export class InterceptorsChapterInterceptor implements NestInterceptor {
  // จากนั้น NestInterceptor จะบังคับให้เราต้องมี intercept()
  // และ intercept() จะรับ parameter 2 ตัวคือ ExecutionContext และ CallHandler
  // ExecutionContext ก็เหมือนกับที่เราใช้ใน Guard เลย
  // ส่วน CallHandler จะพิเศษกว่าหน่อย เหมือน next() ของ Middleware แต่ว่ามี .handle() ให้ใช้ด้วย
  // แล้วทำไมถึงต้องมี .handle() มาด้วยถ้าเกิด next() ก็ทำหน้าที่ส่งผ่านการทำงานได้?
  // อย่างแรกเลยคือ .handle() จะส่งค่า Observable กลับมา แปลว่าทำงานแบบ asynchronous
  // ในขณะที่ next() ทำงานแบบ synchronous ทำให้เราจะเขียน asynchronous ได้อย่างจำกัดบน Middleware
  // อย่างที่สอง พอเราเรียกใช้ next() แล้วจะส่งต่อการทำงานทันที ไม่สามารถเขียนอะไรเพิ่มได้อีก
  // แต่ .handle() จะส่งค่า Observable กลับมา ทำให้เราเขียนการทำงานหลังจาก Handler ทำงานแล้วได้
  // อย่างที่สาม ในการเปลี่ยนแปลง Response .handle() จะทำได้ดีกว่าเพราะว่ามี map() ให้ใช้
  // แต่ถ้าเราใช้ next() เราจะต้องไปนั่งแก้หรือสร้าง Response เอาเอง ยุ่งยากกว่า
  // สุดท้าย เราสามารถเขียน Exception Handling ได้ใน Observable แต่ว่า next() ทำไม่ได้
  // ด้วยเหตุผลเหล่านี้ทำให้ Interceptor จะเหมาะกว่าถ้าในกับโค้ดใน Framework
  // ถ้านอก Framework ให้ใช้ Middleware เช็คเบื้องต้นก่อนจะส่งเข้ามาใน Framework ดีกว่า
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // โค้ดที่เราจะเขียนใน Body จะนับว่าทำงานก่อนที่ Request จะถูกส่งไปให้ Handler
    const time = Date.now();
    console.log(time);

    // จากนั้นเราสามารถเรียก .handle() เพื่อส่ง Request เข้าไปใให้ Handler ทำงานได้
    // แล้วหลังจาก handle() ก็คือโค้ดการทำงานหลังจาก Handler ของเราทำงานเรียบร้อยแล้วนั่นเอง
    // ในการเขียนโค้ดที่จะทำงานหลังจาก Handler เราจะใช้ method chaining ต่อจาก handle()
    // ต้องเข้าใจก่อนว่า ถ้าเราจะใช้ Observable Chaining Method ได้แปลว่าเราต้องมี Observable ก่อนแล้ว
    // เราได้มาจาก .handle() นี่แหละ เลยทำให้เราสามารถใช้ rxjs method ได้ ซึ่งมีหลายตัว เราจะเลือกแต่ตัวสำคัญมาพูด
    // โดยตัวแรกที่เราจะเขียนคือ .pipe() เช่น next.handle().pipe(...)
    // .pipe() จะเป็นแหล่งรวม method ของเราเอาไว้ในนี้โดยจะคั่นด้วย ,
    // เช่น next.handle().pipe(map(...), tap(...), ...)
    // map() เป็น method หนึ่งของ rxjs จะเอาไว้ใช้แปลงข้อมูลให้เป็นแบบที่เราอยากได้
    // เช่น next.handle().pipe(map(data => data + 1)) ข้อมูลเราก็จะถูกบวกไป 1
    // tap() จะเป็นโค้ดที่ไม่ก่อให้เกิดการเปลี่ยนแปลงกับข้อมูลของเรา (side effect)
    // เช่น next.handle().pipe(map(data => data + 1), tap(value => console.log(value)))
    // filter() จะเอาไว้ใช้กรองข้อมูลตาม condition ที่เรากำหนดเอาไว้
    // เช่น next.handle().pipe(filter(age => age > 18))
    // ก็คือ แทนที่เราจะเขียน code ด้านหลัง arrow ให้เราเขียน condition เอาไว้แทน
    // ตัวสำคัญอีกตัวหนึ่งก็คือ catchError() ที่เราจะเอาไว้จัดการกับข้อผิดพลาดที่เกิดขึ้นในโปรแกรม
    // เนื่องจาก Interceptor ทำงานในระดับ Framework ดังนั้นการส่ง HttpException กลับไปให้ Client ก็ไม่ควร
    // จะเหมาะกับการใช้ในโปรแกรมมากกว่า เช่น .pipe(catchError(err => throw new Error('bug!')))
    // มาที่ swithcMap() กับ mergeMap() ที่มีการทำงานคล้ายกันมาก ๆ
    // เปรียบเทียบคือ switchMap() จะเหมือนการที่เราวาง Subscription เดิมลงแล้วใช้ Subscription ที่เราสร้างใหม่
    // แต่ว่า mergeMap() คือการที่เราสร้าง Subscription ใหม่แล้วเปิดการทำงานแยกกับตัวแรกไปเลย ไม่ปิดตัวไหนซักตัว
    // แปลว่า mergeMap() ก็คือจะสร้างและรับ Subscription ได้พร้อมกันหลายตัว โดยจะทำงานแยกกันหมด
    // ส่วน switchMap() จะสร้าง Subscription ใหม่ ปิดการทำงานเก่า แล้วใช้ตัวใหม่แทนไปเลย
    return next.handle().pipe(switchMap((data) => data + 1));
  }
}
