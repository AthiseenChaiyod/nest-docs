import { Controller, Get, UseGuards } from '@nestjs/common';
import { GuardsChapterGuard } from './guards-chapter.guard';
import { Roles } from './guards-chapter.reflector';

@Controller('guards')
// เราเรียกใช้งาน Guard เอาไว้ที่ Controller Scope ดังนั้น Guard จะทำงานทุกครั้งที่มี Request ส่งมาที่นี่
// สามารถประกาศแบบ Method Scope ก็ได้ หรือจะประกาศแบบ Global Scope ก็ได้
// ใช้ .useGlobalGuards() เหมือนกับ .useGlobal...() อื่น ๆ ได้เลย
// ภายใต้ข้อจำกัดเดียวกัน คือถ้าเราประกาศแบบ Global จะอยู่นอก injection context
// ทำให้เราต้องไปประกาศ custom provider { provide: APP_GUARD. useClass: ... } เอาไว้ที่ root ด้วย
// จะทำให้เราสามารถใช้งาน injection ใน Guard ของเราได้
@UseGuards(GuardsChapterGuard)
export class GuardsChapterController {
  @Get()
  // ก่อนที่เราจะใช้งาน Custom Decorator ได้เราก็ต้องสร้างมันขึ้นมาก่อน
  // อ่านได้ที่ guards-chapter.reflector.ts
  // จากโค้ดด้านล่าง เราสร้าง Decorator ที่ชื่อว่า Roles และกำหนด 'admin' เป็นค่าของมัน
  // เมื่อเรา extract ด้วย .get() ก็ให้เราใส่ Roles, context.getHandler() ไปเป็น arguments
  // จะทำให้เราได้ 'admin' กลับไป ถ้าเราใช้ string[] เป็น type ของ Reflector เราก็จะได้ ['admin']
  @Roles(['admin'])
  getIndex() {
    return `This is GET route.`;
  }
}
