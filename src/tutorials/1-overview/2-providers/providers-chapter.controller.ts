import { Controller, Get, Inject, Optional, Param } from '@nestjs/common';
import { ProvidersChapterService } from './providers-chapter.service';

@Controller()
export class ProvidersChapterController {
  // ในการ inject ให้เราสร้างตัวแปร type เดียวกับ service ที่เราจะใช้ใน () ของ constructor
  // ให้ใช้ camelCase เป็นชื่อตัวแปรของ service และควรใช้ชื่อเดียวกัน จะได้อ่านง่าย
  // ง่าย ๆ ก็คือสร้าง instance ของ class นั่นแหละ
  // วิธีการ inject นี้เรียกว่า constructor based injection
  // และปกติแล้วเวลาที่เรา inject service ที่อาจจะไม่ได้ถูกส่งมาใช้งาน (หรือ NestJS หาไม่เจอ)
  // ให้เราใส่ @Optional() เอาไว้ด้วย เพื่อระบุว่าถ้าไม่มีก็ไม่ Error นะ
  // แต่จะให้ instance มีค่าเป็น null / undefined แทน
  constructor(
    @Optional() private providersChapterService: ProvidersChapterService,
  ) {}

  // แม้ว่าเราจะใช้ constructor-based injection อยู่ตลอด แต่ก็มีการ inject อีกแบบ
  // property-based injection ที่จะ inject ผ่านการใช้ @Inject() name: type
  // ข้อแตกต่างของทั้งสองแบบคือ constructor-based instance จะถูกสร้างพร้อม class instance
  // ส่วน property-based จะสร้าง instance หลังจาก class instance ถูกสร้าง
  // ดังนั้น property-based จะไม่เหมาะกับการ test ที่ต้องใช้ instance ตั้งแต่ตอนสร้างเลย
  // เหมาะกับกรณีที่ใช้ service หลังจาก class instance ถูกสร้างแล้วเฉย ๆ
  // ในการสร้างก็ให้ใช้ @Inject() Decorator แปะเอาไว้แล้วสร้างตัวแปรเหมือน constructor-based เลย
  // แล้วก็เหมาะกับ class ที่ extends จากอีก class มา
  // เพราะว่าเราจะต้องประกาศ super() เอาไว้เสมอสำหรับทุก ๆ injection
  // เช่น สมมติว่าเรามี parent class ที่ inject dependencies เข้ามา 10 ตัว
  // เวลาเรา extends มาใช้ใน child เราก็ต้องประกาศ super() และสร้าง instance service ด้วยทุกครั้ง
  // โค้ดเราจะวุ่นวาย ให้เรา @Inject() เอาเลย ไม่ต้องเขียน constructor() จะได้ไม่ต้องเขียนโค้ด override
  @Inject()
  private providersChapterService2: ProvidersChapterService;

  @Get()
  getAll() {
    // ตอนใช้งานก็แค่ this.service_name.service_method() ได้เลย
    return this.providersChapterService.getAll();
  }

  @Get(`:id`)
  getOne(@Param('id') id: string) {
    // ถ้ามี parameter ก็ให้ส่งผ่าน () ได้เลย
    return this.providersChapterService.getOne(id);
  }
}
