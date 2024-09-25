import { Module } from '@nestjs/common';
import { CustomProvidersChapterService } from './custom-providers-chapter.service';

@Module({
  // โดยปกติแล้วเราจะใส่ Class เข้าไปใน metadata ของ Module เลย เช่น providers: [SomeService]
  // นั่นคือการเขียน Shorthand หน้าตาจริง ๆ ของมันคือ { provide: token, useClass: class }
  // เช่น { provide: SomeService, useClass: SomeService }
  // โดย provide จะรับค่า token เป็น string / class
  // ถ้าเกิดเราใช้ string เป็น token เราจะต้องใช้ @Inject() ในการทำ injection เท่านั้น
  // เช่น { provide: 'SOME_SERVICE', useClass: SomeService }
  // เวลาที่เรา inject ก็จะเป็น @Inject('SOME_SERVICE') private someService: SomeService;
  // หรือถ้าเราจะใช้ class เป็น token ก็จะทำให้เราสามารถ constructor-based injection ได้ปกติ
  // เช่น { provide: SomeService, useClass: SomeService }
  // เราก็จะ inject แบบปกติที่เราเคยทำมา constructor(private someService: SomeService) {}
  // ซึ่ง Token จะไม่ใช่ชื่อ class เดียวกันกับ useClass ก็ได้
  // เช่น { provide: FirstClass, useClass: SecondClass }
  // เวลาที่เรา inject เราก็จะใช้ FirstClass
  // แต่เวลาเรียกใช้ ค่าของมันจะเป็น instance ของ SecondClass
  // ไม่ควรประกาศชื่อ token ให้แตกต่างจาก useClass เพราะจะงงเอา
  providers: [
    {
      provide: CustomProvidersChapterService,
      useClass: CustomProvidersChapterService,
    },

    // นอกจาก useClass แล้วก็ยังมีตัวเลือกให้ใช้อีก ตัวแรกก็คือ useValue
    // เหมาะกับการที่เราจะ inject ค่าคงที่, library ภายนอก และ mockObject สำหรับการ test
    { provide: 'ValueService', useValue: 1 },

    // อีกตัวหนึ่งคือ useFactory แทนที่เราจะใส่ค่าคงที่หรือ class ไป เราจะใส่ arrow function ไปแทน
    // โดยเราสามารถ inject เข้ามาใน useFactory ได้ด้วย โดยการส่งค่ามาใน () ของ arrow
    // เช่น (someService: SomeService) => { ... }
    // แต่ว่าถ้าเรา inject บางอย่างเข้ามา เราต้องไปประกาศ inject: [...] เอาไว้ด้านล่างของ useFactory ด้วย
    // inject: [...] ก็เหมือนกับ providers: [...] นั่นแหละ จะรับค่า class หรือ optional object
    // รับ class ก็เหมือนที่เราประกาศใน providers: [] เลย เช่น inject: [SomeClass]
    // อีกแบบคือ optional object ที่จะรับ { token: string, optional: boolean }
    // เช่น inject: [{ token: 'SomeToken', optional: true }]
    // ใด ๆ ก็ตาม อย่าลืมใส่ ? เอาไว้ตรง optional argument ด้วย เพื่อบอกว่าตัวนี้เป็น optional
    {
      provide: 'UseFactoryToken',
      useFactory: (
        customProvidersChatperService: CustomProvidersChapterService,
        optionalProvider?: string,
      ) => {
        return 0;
      },
      inject: [
        CustomProvidersChapterService,
        { token: 'OPTIONAL_TOKEN', optional: true },
      ],
    },

    // ตัวสุดท้ายคือ useExisting
    // ถ้าเรามี provider 2 ตัวที่ใช้ useClass ชี้ไปยัง Class ตัวเดียวกัน
    // ทั้ง 2 provider นั้นจะมีค่าเป็น class เดียวกัน แต่คนละ instance
    // แต่ถ้าเกิดมีตัวนึงใช้ useExisting ชี้ไปยัง Class แทน
    // ตัวที่ใช้ useExisting จะมีค่าเป็น Class เดียวกัน และเป็น instance ตัวเดียวกันด้วย
    { provide: 'SAME_PROVIDER', useExisting: CustomProvidersChapterService },
  ],
})
export class CustomProvidersChapterModule {}
