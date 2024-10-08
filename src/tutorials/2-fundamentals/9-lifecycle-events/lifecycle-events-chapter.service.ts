import { Injectable } from '@nestjs/common';

// คำอธิบายง่าย ๆ ของ Lifecycle ก็คือ วงจรการทำงานของ Application ตั้งแต่เริ่มต้นจนจบการทำงาน
// NestJS จะแบ่งการทำงานออกเป็น 3 phase คือ initializing, running, terminating
// initializing ก็คือช่วงเริ่มต้นของ Application
// running คือช่วงถัดจาก initializing เป็นช่วงที่ Application กำลังทำงาน
// และสุดท้าย terminating ก็คือช่วงที่ Application กำลังจะหยุดการทำงาน
// โดย NestJS จะมี method มากมายให้ใช้งานตามช่วงการทำงานต่าง ๆ ของโปรแกรม
// ก่อนที่เราจะไปพูดถึงเรื่องการทำงาน เราจะมาพูดถึงเรื่องการสร้าง instance ของ NestJS กันก่อน
// การที่ NestJS จะสร้าง instance ของ Module ทุกตัวใน Application ได้นั่นจะเริ่มที่ Root เสมอ
// แต่ว่าถ้ามีการ imports Module เข้ามา Root เราก็จะต้องไปสร้าง Child Module ก่อน
// จะทำซ้ำกับ Child Module ไล่ลงไปเรื่อย ๆ
// จนพอถึงตัวสุดท้ายเราถึงจะเริ่มสร้าง Instance ของมันไล่ขึ้นไปข้างบน
// แล้วเราจะได้ DI Tree มา (นึกภาพคล้าย ๆ Tree diagram ของ instance)
// ในระหว่างที่กำลังสร้าง Instance (ไล่จากล่างขึ้นบน)
// ถ้าเกิดเราสร้าง instance เสร็จใดแล้วมันมี onModuleInit() ก็จะ Trigger ทันทีที่สร้างเสร็จ
// สรุปคือเริ่มสร้าง Instance จาก root ก่อน ถ้า Root มี Child ก็จะไปสร้าง Child ก่อน
// ทำซ้ำไปเรื่อย ๆ จนสุดท้ายเราก็จะรู้ว่า child ตัวสุดท้ายคืออะไร พอถึงขั้นนี้เราก็จะรู้แล้วว่า Diagram เราเป็นยังไง
// จากนั้นก็จะเริ่มสร้าง Instance จากตัวสุดท้าย ไล่ขึ้นมาจนถึง Root
// ถ้ามี onModuleInit() พอสร้าง instance เสร็จก็จะ trigger ไปเลย
// เช่น ถ้าเราประกาศ onModuleInit() เอาไว้ที่ service แล้วเราก็เอาไปไว้ใน Module A
// จากนั้นเรา import Module A ไปไว้ใน AppModule
// จากตัวอย่างเราจะได้ AppModule -> ModuleA
// ในการสร้าง instance เราก็มาดูที่ AppModule ก่อน ซึ่งจะเห็นว่าเรา imports: [ModuleA]
// เราก็จะกระโดดไปสร้าง ModuleA ก่อนค่อยกลับมาสร้าง AppModule ทีหลัง
// และ ModuleA ไม่มี Child Module แล้ว ทำให้ก็จะสร้าง instance ของ ModuleA เลย
// พอเราสร้าง ModuleA เสร็จก็จะ trigger onModuleInit() ของ ModuleA
// แล้วก็ไล่ขึ้นไปข้างบน นั่นก็คือ AppModule แล้วก็ trigger onModuleInit() ของ AppModule
// เหมือนกันกับ onModuleDestroy() ที่เราก็จะระเบิดจากตัวล่าง ๆ ก่อน แล้วไล่ขึ้นบน
// พอเข้าใจตรงนี้แล้วเราจะอ่าน onModule...() ได้เข้าใจขึ้น อ่านต่อด้านล่างได้เลย
@Injectable()
export class LifecycleEventsChapterService {
  // onModuleInit() { ... }
  // จะทำงานเมื่อ instance ของ root Module ถูกสร้างขึ้น
  onModuleInit() {
    console.log(`Root module initialized!`);
  }

  // onApplicationBootstrap() { ... }
  // จะทำงานเมื่อ Application สร้าง instance ครบแล้ว bootstrap อะไรเรียบร้อย พร้อมทำงาน
  onApplicationBootstrap() {
    console.log(`Application bootstraped!`);
  }

  // ส่วน phase ของการ running จะไม่มี lifecycle events ให้ใช้งาน จะข้ามไปส่วนของ terminating เลย
  // หากต้องการใช้ events ที่เกี่ยวกับ terminating จะต้องไป enable ที่ main.ts ด้วย
  // terminating phase จะเริ่มขึ้นเมื่อ Application ได้รับ signal ว่าจะหยุดการทำงาน
  // Application ก็จะเริ่มทำลาย instance ที่เหลืออยู่ก่อนที่จะปิดการทำงาน
  // onModuleDestroy() { ... } ก็จะทำงานหลังจากที่ Root instance ของมันเองถูกทำลายลง
  // เป็นด้านตรงข้ามของ onModuleInit()
  onModuleDestroy() {
    console.log(`Root module destroyed!`);
  }

  // beforeApplicationShutdown() { ... }
  // จะทำงานเมื่อ Application พร้อมที่จะปิดการทำงานของตัวเองแล้ว (ทำลาย instance เรียบร้อยแล้ว)
  // สำคัญ: `ทำงานก่อนที่จะปิดการทำงาน ไม่ใช่หลังปิดการทำงานแล้ว`
  beforeApplicationShutdown() {
    console.log(`Before terminating!`);
  }

  // onApplicationShutdown() { ... }
  // จะทำงานหลังจาก Application ปิดการทำงานตัวเองแล้ว (ถัดจาก beforeApplicationShutdown())
  onApplicationShutdown() {
    console.log(`Terminated!`);
  }

  getIndex() {
    return `This is Lifecycle Events Chapter!`;
  }
}
