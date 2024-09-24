import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { InterceptorsChapterInterceptor } from './interceptors-chapter.interceptors';

@Controller('interceptors')
export class InterceptorsChapterController {
  @Get()
  // ในการใช้งาน Interceptor เราก็แปะ @UseInterceptors() เอาไว้ที่ Scope ได้เลย
  // เหมือนกับอย่างอื่นที่กล่าวมาแล้ว เราสามารถแปะได้ทั้ง Controller Scope, Global Scope
  // ถ้าอยากแปะ Global ก็ใช้ .useGlobalInterceptors() ที่ app เราได้เลย
  // ถ้ามีการ Inject ข้างในโค้ด Interceptor เราก็จะบั๊กเหมือนเดิม เพราะอยู่นอก Injection Context
  // ใช้วิธีการสร้าง Custom Provider { provide: APP_INTERCEPTOR, useClass: ... } แปะเอาไว้ที่ root
  @UseInterceptors(InterceptorsChapterInterceptor)
  getIndex() {
    return `This is index page.`;
  }
}
