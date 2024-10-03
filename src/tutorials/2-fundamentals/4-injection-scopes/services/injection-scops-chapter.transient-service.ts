import { Injectable, Scope } from '@nestjs/common';

// ส่วนตัวสุดท้ายคือ TRANSIENT Scope ที่จะสร้าง Instance ทุกครั้งที่ถูก inject
// แต่ว่าจะไม่สร้าง instance ใหม่ให้ถ้าเกิดว่าเรา inject ไปไว้ใน consumer เดียวกัน
// สมมติว่ามี Controller A แล้วเรา inject Service A, Service B เข้าไป
// โดยเราใส่ type ให้ Service A และ B เป็น SomeService
// ถ้า Transient คือการสร้าง instance ใหม่ทุกครั้งที่มีการ inject แปลว่าเราต้องได้ทั้ง instance A และ B
// แต่ไม่ใช่ ทั้ง A และ B จะเป็นตัวเดียวกันใน Controller A เพราะว่าเราประกาศเอาไว้ในที่เดียวกัน
// หมายความว่า NestJS จะจัดการ Transient แบบ per consumer ไม่ใช่ per injection
// ถ้าสมมติเหตุการณ์เดียวกับ Scope.DEFAULT ที่เรายกตัวอย่างไป
// Module A มีการประกาศ providers: [SomeService], exports: [SomeService] เอาไว้
// สมมติว่า SomeService เป็น Transient
// แล้วเรา imports Module A ไปใช้ใน Module B, Module C
// ถ้าเป็น Scope.DEFAULT ตรงนี้ Module A, B จะได้ Instance ตัวเดียวกัน
// แต่ถ้าเราใช้ Transient จะเป็นคนละตัวกัน
// แต่ถ้าเกิดเราอยากได้ instance คนละตัวใน consumer เดียวกันจริง ๆ เราก็สามารถทำได้
// ให้เขียน useFactory ที่จะ return new Instance() ของ service ที่เราต้องการใน custom provider ของ Module
@Injectable({ scope: Scope.TRANSIENT })
export class InjectionScopesChapterTransientService {
  constructor() {
    console.log(`Scope.TRANSIENT created!`);
  }

  getIndex() {
    return `This is Scope.TRANSIENT!`;
  }

  // ตัวอย่างเดียวกับ Scope.DEFAULT ที่จะนับตัวแปรเพื่อเช็คว่า instance แต่ละตัวมีค่าเท่ากันหรือไม่
  // ในกรณีนี้หาก inject ไปคนละ consumer จะนับว่าเป็น instance คนละตัวกัน
  // หมายความว่า Module A (ตัว root) กับ Module B, C ที่เป็น Child จะได้คนละ instance หมดเลย
  counter: number = 0;
  getValue() {
    return this.counter++;
  }
}
