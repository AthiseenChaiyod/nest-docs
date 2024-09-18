import { Injectable } from '@nestjs/common';
import { ProvidersChapterInterface } from './providers-chapter.interface';

// หาก Controller เอาไว้สั่งให้ Request ไปไหน Provider ก็คือให้ Request ทำอะไรเมื่อถูกส่งมาที่นี่
// ถูกสร้างโดยการแปะ @Injectable() Decorator ไว้บน export class
// ส่วนการนำ provider ไปใช้งาน เราก็จะต้อง inject เข้าไปในโค้ดที่เราจะนำไปใช้
// สามารถดูการใช้งานได้ที่ providers-chapter.controller.ts
@Injectable()
// โดยทั่วไปแล้วให้แปะ Service เอาไว้เป็น Suffix เสมอ จะได้ maintain ง่าย
export class ProvidersChapterService {
  // ข้างใน class เราก็จะเขียน function เอาไว้ให้ Controller เรียกใช้
  // ที่จริงก็สามารถเขียน function ที่ Controller ได้เลย แต่ว่าที่แยกกันเพราะจะได้ maintain ง่าย
  // เขียนเหมือน function ปกติ ไม่ต้องมี Decorator อะไรแปะหัวไว้
  getAll() {
    return `This is get one method.`;
  }

  // ส่ง parameter มาด้วยก็ได้
  getOne(id: string) {
    return `This is get all method with ${id}`;
  }

  // หากเราต้องการที่จะใช้ type ที่เราสร้างเอง สามารถทำได้โดยการใช้ interface เป็น type แทน
  // วิธีการสร้างดูได้ที่ providers-chapter.interface.ts
  create(data: ProvidersChapterInterface) {
    return data;
  }
}
