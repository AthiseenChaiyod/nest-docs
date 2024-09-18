import { Module } from '@nestjs/common';
import { ModulesChapterController } from './modules-chapter.controller';
import { ModulesChapterService } from './modules-chapter.service';
import { ModuleForImportModule } from './module-for-import/module-for-import.module';

// Module เปรียบเสมือนกล่องเครื่องมือ ที่เก็บ Controller / Provider เอาไว้
// เวลาที่เรา import ไปใช้ ก็แค่ import Module ไปอย่างเดียว
// ไม่ต้องประกาศ Controller / Provider เพราะรวมอยู่ใน Module เรียบร้อยแล้ว
// สร้างโดยแปะ @Module() เอาไว้บน export class
// ที่พิเศษกว่าตัวอื่นหน่อยคือ จะต้องมี object {} อยู่ใน () ของ @Module() ด้วยเสมอ
// เพราะ object นี้จะเป็นที่สำหรับ register Controller / Provider ของเรานั่นเอง
// โดยข้างในจะมี imports, exports, controllers, providers ทั้งหมด 4 ตัว
// จะประกาศทั้งหมดหรือไม่ก็ได้ ทุกตัวจะรับค่า class[]
// หาก Module นี้ใช้งานในทุกที่ ก็สามารถประกาศแบบ Global ได้
// เพียงแค่ใช้ @Global() แปะเอาไว้ล่าง @Module()
@Module({
  // Module นี้ใช้ Controller ตัวไหนบ้าง เอามาไว้ตรงนี้
  // Module อื่นที่ import Module นี้ไปใช้จะสามารถเข้าถึง path ของ ModulesChapterController ได้
  controllers: [ModulesChapterController],

  // Module นี้ใช้ Provider อะไรบ้างก็เอามารวมไว้ในนี้
  providers: [ModulesChapterService],

  // Module นี้ต้องใช้ Module ไหนก็เอามาใส่ไว้ในนี้
  // เราจะสามารถใช้ส่วน exports ของ Module ที่ระบุเอาไว้ด้านล่างได้
  imports: [ModuleForImportModule],

  // Provider ตัวไหนที่เราอยากให้ Module อื่นใช้เมื่อ import Module นี้ไป ก็ให้เอามาไว้ตรงนี้
  // ถ้าแค่ import ไปแล้วไม่ต้องเรียกใช้อะไรของ Module นี้เลยก็ไม่ต้องใส่ก็ได้
  // เหมาะกับพวก Module ส่วนกลางมากกว่า ที่ reusable ได้ เอาไปใช้บ่อย ๆ อะไรแบบนี้
  // หรือสมมติว่าเรา import Module อื่นมาใช้ในนี้ เราจะ export Module ที่เรา import มาตรงนี้ก็ได้
  // ทำให้เราสามารถเรียกใช้งาน Module ที่ถูก import มาในนี้ ผ่านการ import Module นี้จากที่อื่นได้
  // (Module A) -- import --> (Module B) -- export A --> (Module C)
  // จากความสัมพันธ์ด้านบน เราสามารถใช้ A ใน C ได้ เป็นต้น
  // Module ที่ imports Module นี้ไปใช้จะสามารถเข้าถึงสิ่งที่มีใน exports ของ Module ที่ระบุได้
  // ถ้า exports Module ก็จะนำ exports ของ Module ที่ระบุไปให้ Module อื่นใช้งานได้
  exports: [ModulesChapterService, ModuleForImportModule],
})
export class ModulesChapterModule {
  // เราสามารถ inject service มาใช้ใน Module ได้
  constructor() {}
}
