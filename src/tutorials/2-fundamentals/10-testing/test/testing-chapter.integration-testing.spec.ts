import { TestingChapterService } from '../testing-chapter.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TestingChapterController } from '../testing-chapter.controller';
import { TestingChapterSecondService } from '../testing-chapter.service-2nd';

// ตัวอย่างด้านล่างจะเป็นการทำ Integration Testing ว่า Service / Controller ทำงานสอดคล้องกันไหม
// ถ้ายังงงอยู่ให้ไปอ่านที่ test-chapter.service.spec.ts ก่อน
describe('TestingChapterController', () => {
  let mockControllerViaInstance: TestingChapterController;
  let mockControllerViaModule: TestingChapterController;

  beforeEach(async () => {
    // เมื่อพูดถึง Integration Testing แล้วก็จะต้องมีเรื่องของ Mock / Spy เสมอ
    // สมมติว่าเรามี Controller ตัวหนึ่ง inject Service มา 5 ตัว
    // ทุกครั้งที่เรา Test เราก็จะต้องสร้าง instance ของพวกมันใหม่ตลอด
    // แล้วสมมติ Application ของเราเขียน test เอาไว้ 40-50 files ก็สร้าง instance ตาแตกพอดี
    // การ Mock ก็คือการสร้างตัวสมมติของ Instance ภายนอกนั้น
    // เช่น Controller นี้ต้องการ Service A, Service B
    // เราก็จะทำการสร้างตัวก็อปปี้ A, B ทำให้ Controller ของเราไม่ต้องมานั่งสร้าง instance เยอะแยะวุ่นวาย
    // โดยเรามีวิธีทำ Mocking นี้ได้หลายวิธี
    // วิธีแรกที่เราจะพูดถึงคือการทำ Mocking แบบ Manual
    // สร้าง Mocking object ขึ้นมาเอง แล้วก็ pass ไปใน instance ของตัวที่เราจะทดสอบ (ผ่าน ())
    // condition อย่างเดียวของวิธีนี้ก็คือ เราจะต้องสร้าง instance แบบ manual เพื่อให้เราสามารถส่งค่าผ่าน () ได้
    // โดยอันดับแรก ให้เราสร้าง object ขึ้นมาก่อน
    // แล้วเราก็นำชื่อ method มาเป็น key ส่วน value จะใช้ jest.fn() เพื่อทำการ Mock function ขึ้นมา
    // ข้างใน jest.fn() เราก็สามารถใส่ value ให้ return ค่าที่เราจะใช้ทดสอบได้
    // เช่น getIndex: jest.fn(() => { return `some string` })
    const mockTestingChapterService = {
      getIndex: jest.fn((): string => {
        return 'Mocking via Instance: Worked!';
      }),
    };
    const mockSecondService = {
      getValue: jest.fn(() => {
        return 'Mocking via Instance: Worked!';
      }),
    };
    // จากโค้ดนี้ เราส่ง object ที่เราเพิ่งสร้างเข้าไปแทนการเรียกใช้ external service โดยตรง
    // ทำให้เราไม่ต้องไปยุ่งอะไรกับ instance ของ external เลย การ test เราก็จะเร็วขึ้น
    // แต่ว่าถ้า controller ของเรามีหลาย injection เราก็ต้องสร้าง mock object หลายตัวด้วย
    // ถ้าไม่อย่างนั้นจะขึ้นเตือนว่า Instance ที่จะสร้างขาดไปอีกหนึ่ง argument นะ
    mockControllerViaInstance = new TestingChapterController(
      mockTestingChapterService as any,
      mockSecondService as any,
    );

    // หากเรามี injection เยอะหน่อย เราอาจจะไปใช้ .override...() เพื่อแก้ไขบาง dependency ของ Module ได้
    // เช่น อยากเปลี่ยนจาก ServiceA เป็น mock-object เราก็ใช้ .overrideProvider() กับ ServiceA ก่อน
    // จากนั้นเราก็ค่อยใช้ .useValue() ตามหลัง โดยจะใส่ค่าตัวแปร mock-object ที่เตรียมไว้เข้าไปใน ()
    // จะช่วยให้โค้ดอ่านง่ายกว่าการที่เรามาทำ manual integration testing เองด้วย
    const overrideModule = await Test.createTestingModule({
      providers: [TestingChapterService, TestingChapterSecondService],
    })
      .overrideProvider(TestingChapterService)
      .useValue(mockTestingChapterService)
      .overrideProvider(TestingChapterSecondService)
      .useValue(mockSecondService)
      .compile();

    // นอกจากการส่ง Mock object ไปให้กับ manual instance โดยตรงแล้วเรายังสร้างได้อีกวิธี
    // นั่นก็การสร้างผ่าน TestingModule
    // อันดับแรก ให้เราสร้าง TestingModule แบบปกติที่เราเคยสร้าง โดยจะต้องแปะ controllers เอาไว้ด้วย
    // ส่วน providers ไม่ต้องใส่มา เราจะ mock ค่าของมันมาใช้เองอยู่แล้ว
    // ถ้าเราใส่ providers มาใน module มันจะใช้ค่าของ providers พวกนั้นแทน ต่อให้เรา mock ขึ้นมาแล้วก็ตาม
    // ก่อนหน้า .compile() ให้ใส่ .useMocker() เพิ่มเข้าไป
    // กลายเป็น Test.createTestingModule().useMocker().compile()
    // โดยตัว useMocker() จะรับค่า arrow function 1 ตัว
    // และ arrow ที่ว่านี่แหละที่จะส่งค่า Mock object เหมือนที่เราสร้างแบบ manual กลับมา
    // เช่น .useMocker(() => { getIndex: jest.fn(() => `Worked!`) })
    // แต่ที่พิเศษกว่าแบบ manual คือ .useMocker() เราสามารถรับค่า injection token ได้
    // แล้วก็ useMocker() จะทำงานจำนวนครั้งเท่ากับ injection ของ Controller ที่เราแปะเอาไว้
    // เช่น เราแปะ controllers: [ControllerA] ที่มีการ inject ServiceA, ServiceB เข้ามา
    // แปลว่า useMocker() ของเราจะทำงานสองครั้ง
    // และแต่ละครั้งเราก็จะส่งค่าที่เราเขียนเอาไว้ใน useMocker() กลับไปให้กับ Injection แต่ละตัว
    // และจากตัวอย่างด้านบน ที่เราเขียนส่ง { getIndex: jest.fn(() => `Worked!`) } กลับไป
    // แปลว่า ServiceA, ServiceB ก็จะมีแค่ getIndex ให้ใช้ (useMocker() ส่งค่ากลับไปทับค่าเก่าแล้ว)
    // แต่ถ้าเราใส่ Controller ไปให้กับ .get() สิ่งที่เราจะได้รับกลับมาไม่ใช่ Service / Method พร้อมใช้งาน
    // แต่จะเป็น object ที่มี service เป็น key และมีค่าที่เราเขียนเอาไว้ใน mock เป็น value
    // ดังนั้นให้เราดึง Instance ของ Service ออกมาใช้เองเสมอ โดยใช้ Service ที่เราต้องการ
    // เช่น const serviceA: ServiceA = module.get(ServiceA)
    // ดังนั้น การใช้ useMocker() กับ Instance ที่มีหลาย Injection จะทำให้เราต้องเขียน if else ด้วยเสมอ
    // ไม่อย่างนั้นเราก็จะส่งค่าเดิมกลับไปให้ Injection ทุกตัว ซึ่งไม่มีประโยชน์อะไร
    // ทั้งนี้ทั้งนั้น ถ้าเราจะสร้าง mock object ก็ไม่ใช่ว่าเราจะสร้างอะไรไปก็ได้
    // เช่น เรามี injection ที่มี method ชื่อ getSomething()
    // ใน Controller โค้ดของเราก็เรียกใช้ this.someService.getSomething()
    // แต่ว่าพอเรามาสร้าง mock object เราจะส่ง { getAnother: jest.fn() } กลับไปไม่ได้
    // เหตุผลเพราะว่าเวลาที่เราแทนที่ด้วย mock object แล้ว controller จะไปเรียกใช้ .getAnother() แทน
    // ซึ่ง this.someService.getAnother() ไม่มีอยู่จริง มันก็จะบั๊ก
    // ดังนั้นจะ mock อะไร ทำให้เหมือนตัวต้นฉบับมันด้วยเสมอ
    const mockModule: TestingModule = await Test.createTestingModule({
      controllers: [TestingChapterController],
    })
      .useMocker((token) => {
        if (token === TestingChapterService) {
          return {
            getIndex: jest.fn(() => {
              return `Mocking via Module: Worked!`;
            }),
          };
        } else {
          return {
            getValue: jest.fn(() => {
              return `Mocking via Module: Worked!`;
            }),
          };
        }
      })
      .compile();
    // บรรทัดนี้จะทำให้เราได้ Instance Controller ที่สามารถเรียกใช้ method ที่เรา mock ขึ้นมาได้
    // ถ้าเกิดเราทำ Integration Testing แล้วต้องเรียกใช้ external แทนที่จะเป็น internal ก็คือทำผิดแล้ว
    // เช่น แทนที่จะเรียก controller.method แต่ดันเรียก service.method
    // Test ตัวไหนต้องใช้ตัวนั้นเท่านั้น ไม่มีการใช้ตัวอื่นแทน
    // เพราะถ้าเราเรียกใช้ external ในการทำ Integration Testing ก็ไม่ต่างจากการทำ Unit Testing เลย
    mockControllerViaModule = mockModule.get(TestingChapterController);
  });

  // อีกสิ่งที่แตกต่างจาก Unit Testing คือ Integration Testing จะครอบ it() ด้วย describe()
  // เพราะว่าเราจะทดสอบสิ่งที่ใหญ่กว่า module 1 module ทำให้เราต้องจัดระเบียบเอาไว้ด้วย
  // ในส่วน string ของ describe() จะเป็นชื่อ method ที่เราทดสอบแทน
  // และ string ของ it() จะเป็นรายละเอียดที่เราจะใส่เอาไว้ เช่น ผลลัพธ์ควรเป็นอะไร
  describe('mockControllerViaInstance', () => {
    it('gitIndex', () => {
      expect(mockControllerViaInstance.getIndex()).toBe(
        'Mocking via Instance: Worked!',
      );
    });

    it('getAll()', () => {
      expect(mockControllerViaInstance.getAll()).toBe(
        'Mocking via Instance: Worked!',
      );
    });
  });

  describe('mockControllerViaModule', () => {
    it('getIndex()', () => {
      expect(mockControllerViaModule.getIndex()).toBe(
        'Mocking via Module: Worked!',
      );
    });

    it('getAll()', () => {
      expect(mockControllerViaModule.getAll()).toBe(
        'Mocking via Module: Worked!',
      );
    });
  });

  // อีกวิธีหนึ่งคือการใช้ spy
  // เราจะใช้ jest.spyOn() ในการทดสอบ external instance
  // mock คือการสร้างขึ้นมาใหม่หรือสมมติขึ้น แต่ว่า spy จะเป็นการเอาจากที่มีจริง ๆ มาปรับเปลี่ยน
  // คำสั่งจะประมาณว่า เอา spy ไปแปะไว้ที่ Instance ไหน Method อะไร
  // เช่น jest.spyOn(SomeService, 'getIndex')
  // หลังจากที่ spyOn ถูกใช้งาน method getIndex() ของ SomeService จะถูกตามดูโดย spy
  // ทำให้เราสามารถเช็คได้ว่าถูกเรียกใช้ไปทั้งหมดกี่ครั้ง แต่ละครั้งส่ง argument อะไรไปบ้าง
  // นอกจากนั้น method บางตัวจะสามารถใช้งานได้กับ spy เช่น .toHaveBeenCalledWith(value)
  // toHaveBeenCalledWith() จะเช็คว่าค่าที่รับมาเคยถูกส่งไปเป็น argument ให้กับ method แล้วหรือยัง
  // มีอีกหลายตัวให้ใช้ เช่น toHaveBeenCalledTimes(), toHaveBeenLastCalledWith(), etc.
  // นอกจากการติดตาม method เพื่อดูความเคลื่อนไหวแล้ว spy ก็มีสามารถ override method ได้ด้วย
  // แค่ใส่ .mockImplementation() เอาไว้ด้านหลัง spy ของเรา
  // โดย mockImplementation จะรับค่า arrow 1 ตัว ที่จะเป็น body ที่เราจะ overwrite ตัวหลัก
  // เช่น jest.spyOn(SomeService, 'getIndex').mockImplementation(() => return `Yeah!`)
  // หลังจากเรียก .mockImplementation() แล้ว ถ้าเราเรียกใช้ method การทำงานของมันจะเปลี่ยนไปตลอด
  // ถ้าเราอยากให้เปลี่ยนครั้งเดียว ใช้ .mockImplementationOnce() ก็พอ
  it('Testing with .spyOn()', () => {
    jest
      .spyOn(mockControllerViaModule, 'getIndex')
      .mockImplementationOnce(() => `Hijacked!`);
    expect(mockControllerViaModule.getIndex()).toBe(`Hijacked!`);
  });
});
