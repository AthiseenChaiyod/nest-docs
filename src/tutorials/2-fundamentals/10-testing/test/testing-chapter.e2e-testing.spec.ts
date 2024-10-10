import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TestingChapterController } from '../testing-chapter.controller';
import { TestingChapterService } from '../testing-chapter.service';
import { TestingChapterSecondService } from '../testing-chapter.service-2nd';
import { TestingChapterGlobalGuard } from '../guard/testing-chapter.guard';
import { APP_GUARD } from '@nestjs/core';
import { TestingChapterGlobalGuardService } from '../guard/testing-chapter.service';
import { MockGuard } from '../guard/testing-chapter.mock-guard';

// ตัวสุดท้ายที่เราจะพูดถึงก็คือ E2E Testing (End to End Testing)
// จาก Test ทั้ง 3 ประเภท E2E คือประเภทที่ Scale ใหญ่ที่สุดแล้ว
// Unit Testing จะทดสอบเฉพาะตัว Instance ของมันเอง
// Integration Testing จะทดสอบใน scale ที่ใหญ่ขึ้นมาหน่อย คือทดสอบโครงข่ายของ Instance
// ส่วน E2E Testing จะใหญ่ที่สุด คือทดสอบทั้ง Application เลยว่าทำงานปกติหรือไม่
describe('TestingChapterController (E2E)', () => {
  // อันดับแรกให้เราสร้างตัวแปรที่จะมาแทน Application ของเรา โดยใส่ type INestApplication ให้มันด้วย
  let app: INestApplication;

  // สาเหตุที่ใช้ beforeAll ไม่ใช้ beforeEach เพราะว่าเราต้องการทดสอบ app นี้ตลอดการทำงาน
  // เราอยากรู้ว่ามันทำงานทุกอย่างได้ปกติหรือไม่ ไม่ได้ต้องการทดสอบทีนึงปิดทีนึงเพื่อดูทีละส่วน
  beforeAll(async () => {
    // INestApplication ต้องการค่า Module 1 ตัวเพื่อเป็นตัว start Application เราก็เลยต้องสร้างไว้ตรงนี้
    const module = await Test.createTestingModule({
      controllers: [TestingChapterController],
      // ในการทดสอบ พยายามใช้ instance จริง เพราะว่าเราจะได้รู้ว่ามันทำงานถูกต้องจริงหรือไม่เวลาขึ้น product
      providers: [
        TestingChapterService,
        TestingChapterSecondService,

        // ในกรณีที่เรามี Global ใด ๆ เราก็สามารถนำตัว mock-object มาใช้แทนได้เหมือนกัน
        // เริ่มต้นก็ให้เราประกาศ Global APP_* ในนี้ก่อน เหมือนสร้าง Global ปกติเลย
        // แต่ว่าเราจะใช้ useExisting เพื่อชี้ไปยังตัวเดียวกันแทน
        // ถ้ามี Dependencies ก็อย่าลืม inject ให้เรียบร้อย
        // ทีนี้เราก็สามารถ .override Global ด้วยตัว mock-object ได้แล้ว
        { provide: APP_GUARD, useExisting: TestingChapterGlobalGuard },
        TestingChapterGlobalGuard,
        TestingChapterGlobalGuardService,
      ],
    })
      // อันนี้เป็นเพียงตัวอย่างการ override Global
      // ที่จริงเราต้องสร้าง mock-up object เอง ไม่ควรชี้ไปยัง Class โดยตรง
      .overrideProvider(TestingChapterGlobalGuard)
      .useClass(MockGuard)
      .compile();

    // เสร็จแล้วเราก็ใช้ค่า Module ที่เราเพิ่งสร้างมา boot Application
    app = module.createNestApplication();
    await app.init();
  });

  it('/testing', () => {
    // ในการทดสอบ E2E เราจะต้องมี request ที่มาจาก 'supertest' อย่าลืม import เข้ามา
    // แล้วข้างใน request() เราก็จะส่ง app.getHttpServer() เข้าไป เพื่อทดสอบการยิง APIs
    // ต่อมา ให้ใช้ . ตามด้วยชื่อ HTTP Methods ด้านหลัง เช่น .get(), .post(), etc.
    // โดย HTTP Methods พวกนี้จะรับค่า string path ที่เราจะทดสอบการใช้งาน API
    // เราสามารถ .expect() ตามหลังต่อเพื่อระบุค่าที่ต้องการได้ เช่น HTTP Status เท่าไร มีค่าอะไรกลับมา
    // Request Scope เราก็สามารถทดสอบได้ด้วย
    // แค่แทนที่จะส่งค่า request กลับไป เราก็เก็บมันเอาไว้ในตัวแปรที่หนึ่ง และทำแบบเดียวกันในตัวแปรที่สอง
    // สุดท้ายก็แค่เอา request.text มาเช็คกันว่าค่าที่ได้รับมาตรงกันไหม (เช่น ส่งค่า id กลับมาเทียบกัน)
    return request(app.getHttpServer())
      .get('/testing')
      .expect(200)
      .expect(`This is Testing Chapter!`);
  });

  it('/testing/all', () => {
    return request(app.getHttpServer())
      .get('/testing/all')
      .expect(200)
      .expect(`This is only for test!`);
  });

  // เสร็จแล้วให้มาปิด app ใน afterAll() ด้วย
  afterAll(async () => {
    await app.close();
  });
});
