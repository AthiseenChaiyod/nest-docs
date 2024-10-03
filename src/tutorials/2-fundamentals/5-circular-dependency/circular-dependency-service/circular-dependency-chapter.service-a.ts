import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CircularDependencyChapterServiceB } from './circular-dependency-chapter.service-b';

// สมมติว่าเรามีอยู่ 2 Consumer การที่ A ก็ต้อง imports B และ B ก็ต้อง imports A จะทำให้เกิดการวนเป็นวงกลม
// ทีนี้ NestJS ก็ไม่รู้จะสร้างใครก่อนดี ก่อให้เกิด infinite loop ที่เรียกว่า Circular Dependency
// วิธีแก้ไขก็ให้ไปแก้ให้โค้ดเรามันดีขึ้น ไม่เกิด infinite loop หรือไม่ก็ใช้ forwardRef() ใน Body
// หรือว่าเราจะใช้ ModuleRef ก็ได้ แต่ ModuleRef เราจะเอาไว้กล่าวถึงในบทหน้า ๆ
@Injectable()
export class CircularDependencyChapterServiceA {
  constructor(
    // ทำไมต้องใช้ forwardRef()?
    // ปกติแล้ว เวลาที่ NestJS Initiate ตัวเองขึ้นมาก็จะไล่สร้าง instance ไปเรื่อย ๆ
    // และการสร้าง instance บางตัวก็อาจจะต้องรอสร้าง instance ตัวอื่นก่อน
    // เช่น Controller inject Service เข้ามา
    // แม้ว่าเรากำลังจะสร้าง instance ของ Controller อยู่ แต่เราก็ต้องสร้าง child consumer ก่อน
    // แต่ว่าถ้าเกิด child ก็ดันต้องการ instance ของ parent ด้วยเหมือนกัน ปัญหาก็จะเกิด
    // เพราะว่าเราไม่มี instance ของ child ให้กับ parent เพราะ child ก็อยากได้ instance ของ parent
    // forwardRef() จะส่ง instance เปล่า ๆ ของตัวที่มันกำหนดไปให้ก่อน
    // เช่น Service A, B ต่างต้องการ instance ของกันและกัน
    // ถ้าเราใส่ forwardRef(() => ServiceB) ให้กับ ServiceA ก็จะเป็นการส่ง instance B เปล่า ๆ ไปให้ก่อน
    // เพื่อที่ ServiceA จะได้เรียกใช้ this.serviceB.something() ได้ไม่เกิด error
    // หลังจาก ServiceB initiated เสร็จแล้วจึงค่อยส่ง instance จริง ๆ ของมันมาให้
    @Inject(forwardRef(() => CircularDependencyChapterServiceB))
    private serviceB: CircularDependencyChapterServiceB,
  ) {}
}
