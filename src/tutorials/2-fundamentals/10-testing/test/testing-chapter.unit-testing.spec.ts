import { Test, TestingModule } from '@nestjs/testing';
import { TestingChapterService } from '../testing-chapter.service';

// ในการเขียน test นั้นจำเป็นกับการเขียนโปรแกรมทุกประเภท
// จะดีแค่ไหนถ้าเราสามารถเช็คดูได้ก่อนว่า Application ของเราทำงานได้อย่างถูกต้องก่อนจะ push / deploy
// ประเด็นคือ เราสามารถ test ด้วยตัวเองก็ได้เลยโดยไม่ต้องเขียน test เรียกว่า manual testing
// เราก็จะ run Application ของเรา แล้วก็กดนั่นกดนี่ เพื่อดูว่า Application ทำงานได้อย่างถูกต้อง
// แต่จะทำยังไงถ้าเกิด Application เราทำงานซับซ้อนและโค้ดเยอะมาก ๆ เราก็จะต้องไล่กดกันจนเหนื่อยเลย
// ส่วนอีกแบบคือ Automate Testing ซึ่งก็คือการเขียนโปรแกรมขึ้นมาเพื่อ test โปรแกรม
// เราสามารถพิมพ์แค่คำสั่งเดียว code test ทั้งหมดที่เราเขียนเอาไว้ก็จะทำงาน
// ผลลัพธ์ของแต่ละ test ก็จะแสดงให้เห็นอย่างละเอียดด้วยใน terminal
// ทำให้สะดวกกว่า เขียนครั้งเดียวใช้ได้ตลอดไป
// สำคัญคือการเขียน test มีหลายแบบ ทั้ง Unit Testing, Integration Testing, E2E Testing
// Unit Testing คือการที่เราทดสอบทีละ Instance ของ Application
// เช่น ทดสอบว่า method ภายใน service นี้ทำงานตรงตามต้องการไหม
// ส่วน Integration Testing ก็คือการทดสอบว่าแต่ละ instance สามารถทำงานร่วมกับ instance อื่นได้ไหม
// เช่น ลองเรียก service ใน controller ดูว่าทำงานปกติไหม
// และสุดท้ายคือ E2E (End to End) จะเป็นการทดสอบ Backend ว่าเราสามารถส่ง Req รับ Res ได้ปกติไหม
// ก่อนจะเริ่มเขียน test อันดับแรกให้เราลง package ก่อน
// พิมพ์คำสั่ง npm i --save-dev @nestjs/testing ลงใน terminal
// แม้ Nest จะมีตัวพื้นฐานให้แล้ว แต่ที่ต้องลงก็เพราะว่า package นี้มีอุปกรณ์ที่เกี่ยวข้องกับการ test ให้เลือกใช้เยอะ
// จากนั้นเราก็จะเริ่มการเขียน test โดยเราจะต้องเขียน test ทั้งหมดเอาไว้ใน describe()
// โดย describe() จะรับค่า 2 ตัว คือ string และ arrow function
// string ตัวแรกคือคำอธิบายว่า test นี้คืออะไร
// ส่วนมากแล้วจะตั้งชื่อของ class ที่เราทดสอบใน describe เพื่อให้ไม่สับสนว่าเรา test อะไรอยู่
// ส่วน arrow function ก็จะเป็น body ในการเขียน test ทั้งหมดของเรา
describe('TestingChapterService', () => {
  // เนื่องจากเราไม่สามารถ inject อะไรเข้ามาใน test ได้ เราเลยจะต้องประกาศ instance แบบ manual เอาเอง
  // ส่วนมากก็จะประกาศตัวแปรเอาไว้ด้านบนก่อน เพื่อให้เราสามารถเรียกใช้ได้ ไม่ต้องเขียนซ้ำบ่อย ๆ
  let manualService: TestingChapterService;
  let moduleService: TestingChapterService;

  // beforeEach() เป็น function ที่จะทำงานทุกครั้งก่อน it() แต่ละตัวของ describe() นี้จะทำงาน
  // โดยจะรับค่า arrow function ที่จะเป็น body เขียนโค้ดว่าก่อน it() แต่ละตัวจะทำงานจะต้องทำอะไรก่อนบ้าง
  // โดยส่วนมากก็จะ initialize ตัวแปรที่เราสร้างเอาไว้ในขั้นตอนก่อนหน้า เพราะว่าบาง case ต้องการตัวแปรต่างกัน
  // หรือว่าเราจะสร้าง TestModule ในนี้ก็ได้ แล้วเราค่อย .get() เพื่อเอา instance ออกมา
  // นอกจาก beforeEach() ที่จะทำงานก่อน it() แต่ละตัวแล้ว เราก็มีตัวอื่นให้ใช้อีก
  // afterEach() จะทำงานหลัง it() แต่ละตัว
  // beforeAll() จะทำงานครั้งเดียวก่อน it() ตัวแรกใน describe() จะทำงาน
  // afterAll() จะทำงานครั้งเดียวหลังจาก it() ทุกตัวใน describe() ถูก execute แล้ว
  beforeEach(async () => {
    // ตัวอย่างการสร้าง TestingModule
    // อย่างแรกสร้างตัวแปร type TestingModule
    // ต่อมาใช้ Test ของ '@nestjs/testing' เพื่อที่จะสร้าง Module ด้วย .createTestingModule()
    // ข้างใน () เราก็จะใส่ object ที่มี controllers, providers, imports, exports เหมือน Module ปกติ
    // ง่าย ๆ จะ test อะไรก็ใส่มาใน Module นั่นแหละ
    // อย่าลืมใส่ .compile() เอาไว้ด้วย ไม่งั้นจะนำไปใช้ไม่ได้
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestingChapterService],
    }).compile();

    // ตัวอย่างการ initialize ตัวแปรทั้งแบบ manual และแบบ .get()
    manualService = new TestingChapterService();
    moduleService = module.get<TestingChapterService>(TestingChapterService);
  });

  // เราจะใช้ it() ในการเขียน test แต่ละ case
  // โดย it() จะรับค่า 2 arguments เหมือนกับ describe() เป๊ะ ๆ
  // ตัวแรกคือ string ที่บอกรายละเอียดและ arrow ที่จะเป็น body ของโค้ดการทดสอบทั้งหมด
  // อันดับแรกเรามาพูดถึง Unit Testing กันก่อน
  // Unit Testing ก็คือการ test เฉพาะ instance นั้น ๆ ไม่มีตัวอื่นมาเกี่ยวข้อง
  // เช่น การเรียกใช้ method ของ instance นั้น ๆ เพื่อดูข้อมูลว่าตรงตามที่ต้องการไหม
  // ข้อมูลที่เราจะทดสอบเราจะใส่เอาไว้ใน expect() เพื่อเป็นการบอกว่า ฉันต้องการข้อมูลนี้นะ
  // แล้วหลังจาก expect() เราสามารถทำ method chaining ต่อได้
  // โดยจะมี method มากมายให้ใช้เช็ค เช่น expect(...).toBeDefine() ที่จะเช็คว่าค่าที่ส่งมาเป็น null ไหม
  // ส่วน Integration Testing สามารถอ่านได้ต่อที่ testing-chapter.controller.spec.ts
  it('manualService: getIndex()', () => {
    expect(moduleService.getIndex()).toBe(`This is Testing Chapter!`);
  });

  it('moduleService: getIndex()', () => {
    expect(moduleService.getIndex()).toBe(`This is Testing Chapter!`);
  });
});
