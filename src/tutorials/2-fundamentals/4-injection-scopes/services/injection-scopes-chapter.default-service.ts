import { Injectable, Scope } from '@nestjs/common';

// เวลาเราสร้าง service ทุกตัวจะมี scope เป็นของตัวเอง
// Scopes ทั้งหมดที่มีให้ใช้จะมี 3 ประเภท DEFAULT, REQUEST, TRANSIENT
// ไฟล์นี้จะพูดถึง Scope.DEFAULT ก่อน
// เมื่อเราสร้าง service ด้วย @Injectable() ก็จะมี DEFAULT ให้โดยอัตโนมัติ แม้ว่าเราจะไม่ได้ประกาศใน () ก็ตาม
// DEFAULT ที่เราสร้างกันมาตั้งนานก็คือหลักการหนึ่งของ NestJS ที่จะสร้าง Singleton instance แล้วใช้ทั้ง application
// หมายความว่า DEFAULT Scope จะถูกสร้างตั้งแต่ initiate โปรแกรมเลย
// ให้นึก DEFAULT เหมือนกับ Single Source of Truth
// หมายความว่าถ้าเกิดเราไปประกาศไว้ที่ไหน บนสุดจะนับเป็น root และไล่ลงไปก็จะใช้ instance เดียวกัน
// เช่น เรานำไปประกาศไว้ที่ Module A แปลว่าตัวที่ Module A คือ Root instance
// ถ้าเราใช้ในโค้ดใด ๆ ของ Module เช่น เอาไปใช้ใน Controller ก็ยังถือว่าเป็นตัวเดียวกับ Module A อยู่ดี
// แม้ว่าเราจะสร้าง instance ให้มันใหม่ใน constructor ก็ตาม
// คล้าย ๆ hierarchy ที่ไล่ลำดับจากบนลงล่าง หากมีสายเชื่อมถึงกันได้ก็นับเป็นตัวเดียวกันเสมอ
// แต่ว่ากรณีนี้จะไม่ครอบคลุมถึงการประกาศข้าม Module
// หมายถึง ถ้าเราประกาศใน providers ของ Module A กับ Module B จะนับเป็นคนละตัวกัน
// นอกเสียจากว่าทั้ง Module A และ B จะ imports Module ตัวที่มี service นี้มาในตัวเอง
// เช่น Module A, B ได้ประกาศ imports Module C เอาไว้
// โดย Module C นั้นมีการประกาศ providers เอาไว้ด้วย
// มองแบบ hierarchy แล้ว Module C เป็น Root ให้กับ A, B ดังนั้นจึงนับว่า instance ใช้ร่วมกันทั้ง 3 ตัว
@Injectable({ scope: Scope.DEFAULT })
export class InjectionScopesChapterDefaultService {
  constructor() {
    console.log(`Scope.DEFAULT created!`);
  }

  getIndex() {
    return `This is Scope.DEFAULT!`;
  }

  // ตัวแปรนี้จะใช้ทดสอบว่าถ้าหากเรียกจาก child module แล้วค่าที่ได้จะยังเป็นค่าเดียวกันกับ parent module ไหม
  // ให้เราลอง imports Module ที่ provide service นี้ไปไว้ที่ module อื่น
  // แล้วเราจะลองเรียก Controller ของ parent ที่จะ return คำสั่ง getValue()
  // จากนั้นเราจะไปลองเรียก Controller ของ child ที่ return คำสั่งนี้เหมือนกัน
  // ค่าที่ได้จะต้องเป็นตัวเดียวกัน ไม่ได้เริ่มนับใหม่
  counter: number = 0;
  getValue() {
    return this.counter++;
  }
}
