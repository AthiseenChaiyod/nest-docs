import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MiddlewareChapterMiddleware } from './middleware-chapter.middleware';
import { ModulesChapterController } from '../3-modules/modules-chapter.controller';
import { MiddlewareChapterController } from './middleware-chapter.controller';

// การนำ Middleware มาใช้ จะต้องใช้ใน Module หรือไม่ก็ประกาศแบบ Global เท่านั้น
@Module({
  controllers: [MiddlewareChapterController],
})
// ในการนำ Middleware ที่เราสร้างมาใช้งาน ให้เรา implements NestModule ก่อน
// เพราะว่า NestModule จะมีคำสั่งที่เกี่ยวข้องกับ Middleware ให้เราใช้
export class MiddlewareChapterModule implements NestModule {
  // การ implements NestModule จะบังคับให้เราต้องมี configure()
  // configure() จะเอาไว้ปรับแต่งว่าจะให้ Route ไหนใช้ Middleware ตัวนี้ใน Module บ้าง
  // โดย configure() จะรับ argument 1 ตัว คือ consumer: MiddlewareConsumer
  // การสร้างตัวแปร type MiddlewareConsumer จะทำให้เราใช้คำสั่งที่เกี่ยวข้องกับ Middleware ได้
  configure(consumer: MiddlewareConsumer) {
    // method แรกคือ apply() ถ้าเราอยากใช้ Middleware ตัวไหนใน Module ให้เอามาประกาศไว้ตรงนี้
    // การประกาศให้เราประกาศเป็น class เอาไว้
    // เราสามารถประกาศได้หลายตัว คั่นเอาไว้ด้วย ,
    // forRoutes() จะเอาไว้ตั้งค่าว่าเราจะใช้ Middleware ที่เราประกาศเอาไว้ที่ Route ไหนบ้าง
    // เราสามารถใส่เป็น string ไปเลยก็ได้ เช่น .forRoutes('athiseen')
    // แปลว่าเราจะให้ Middleware นี้แสดงผลบน route localhost:3000/athiseen อย่างเดียว
    // เราสามารถประกาศหลายตัวโดยคั่นด้วย , ได้เหมือนกัน
    // หรือถ้าเราจะจำกัดเฉพาะบาง HTTP Methods ก็สามารถทำได้
    // โดยให้เราสร้าง object ที่มี key เป็น path: string และ method: RequestMethod.VALUE
    // path จะเป็น string เหมือนกับที่เราประกาศไว้ใน .forRoutes() เลย เช่น .forRoutes('some-path')
    // method จะรับค่าจาก RequestMethod Enumerator ให้เรา . เพื่อเลือก Method เอาได้เลย
    // เช่น method: RequestMethod.POST ก็จะเลือกเฉพาะ POST HTTP Request
    // ตัวอย่างการประกาศ object คือ { path: 'anywhere', method: RequestMethod.DELETE }
    // ใน string path เราสามารถใช้ wild card (*) ได้เหมือนกัน
    // และเรายังสามารถประกาศ Controller ใน .forRoutes() ได้ด้วย เพื่อให้แสดงผลทั้ง Controller เลย
    // ไม่งั้นสมมติเรามี 5 Routes ใน Controller ก็ต้องมาประกาศตรง forRoutes() ทีละตัว
    // เราสามารถเลือกได้เหมือนกัน ว่ายกเว้น route ไหน ที่ Middleware จะไม่แสดงผล
    // ใช้ method .exclude() ที่จะรับค่าเหมือนกันกับ .forRoutes() ทุกอย่าง
    // สามารถใส่ string ได้ ใส่ object { path, method } ได้ แต่จะใส่ Controller ไม่ได้
    consumer
      .apply(MiddlewareChapterMiddleware)
      .exclude({ path: 'somewhere', method: RequestMethod.PUT })
      .forRoutes(
        'athi*seen',
        { path: 'Chaiyod', method: RequestMethod.GET },
        ModulesChapterController,
      );
  }
}
