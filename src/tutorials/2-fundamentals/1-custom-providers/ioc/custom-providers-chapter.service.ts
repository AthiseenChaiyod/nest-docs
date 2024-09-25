import { Injectable } from '@nestjs/common';

// เวลาที่เราแปะ @Injectable() เอาไว้กับอะไรสักอย่าง นั่นหมายความว่าเราจะสามารถ inject สิ่งนั้นเข้าไปยังอย่างอื่นได้
// ปกติแล้วถ้าเราไม่ได้ inject เราก็จะต้องสร้าง class / instance เอาเองในโค้ดพวกนั้น
// @Injectable() จะเหมือนกับการบอก NestJS ว่าให้จัดการเรื่องของ Instance พวกนี้ให้ทีนะ
// สรุปก็คือ inject ก็คือการสร้าง class / instance นั่นแหละ แต่ว่าเราให้ Framework สร้างให้เราแทน
// Injectable จะถูกจัดการโดย IoC (Inversion of Control) ที่ทำหน้าที่สร้าง Instance ให้เรา
// อารมณ์ประมาณเราเขียน shorthand นั่นแหละ ให้ parameter ไป เดี๋ยว IoC ไปเขียน instance ให้เอง
// แต่ว่าหากเราอยากลองสร้าง Instance เองโดยไม่พึ่ง IoC มันก็ได้แต่จะยุ่งยากหน่อย (แนะนำให้อ่าน จะได้เข้าใจ)
// อ่านได้ที่ไฟล์ controller ของ folder: no-ioc
@Injectable()
export class CustomProvidersChapterService {
  getIndex() {
    return `This is index page!`;
  }
}
