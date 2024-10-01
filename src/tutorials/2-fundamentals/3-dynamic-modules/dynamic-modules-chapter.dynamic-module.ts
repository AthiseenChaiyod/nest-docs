import { DynamicModule, Module } from '@nestjs/common';
import { DynamicModulesChapterController } from './dynamic-modules-chapter.controller';
import { DynamicModulesChapterService } from './dynamic-modules-chapter.service';
import { DynamicModulesChapterInterface } from './dynamic-modules-chapter.interface';

// โดยปกติ Module ที่เราสร้างมาก็คือ Module ที่แปะข้อมูลไว้ให้เสร็จสรรพแล้ว (ตั้งแต่ตอนสร้าง instance)
// ถ้าเกิดเราอยากแก้ไขค่าขึ้นมา หรือเปลี่ยนแปลง data ของ @Module() เราจะไม่สามารถทำได้ เพราะเราตั้งค่าไปตั้งแต่แรกแล้ว
// ทำให้ต้องมี Dynamic Module เกิดขึ้น
// Dynamic Module ก็คือ Module ที่สามารถปรับแต่งค่าตอนโปรแกรมทำงานอยู่ได้ (runtime)
// อารมณ์ประมาณ กำหนดค่าให้มันใหม่ตอน runtime นั่นแหละ
// โดยขึ้นตอนแรกสุดให้เราสร้าง Module เปล่า ๆ ขึ้นมาตัวนึงก่อน
@Module({})
export class DynamicModulesChapterDynamicModule {
  // จากนั้นเราก็จะเขียน method ข้างในนั้นเป็น static register() { ... }
  // register() จะทำหน้าที่จัดการกับข้อมูลที่เราจะใส่เพิ่มมาให้มันตอน runtime นี่แหละ
  // ส่วน static มีไว้เพื่อให้สามารถเรียกใช้ method นี้ได้โดยไม่ต้องสร้าง instance ใหม่ (จะเห็นการใช้งานอีกทีตอน imports)
  // เมื่อ register() เอาไว้จัดการกับข้อมูลที่จะเข้ามา ดังนั้นก็ต้องรับ parameter 1 ตัว
  // ถ้าเราอยากให้ข้อมูลที่เข้ามาถูก type ครอบ ก็ให้ไปสร้าง interface มาแปะไว้ด้วย
  // แล้วก็แปะ return type เป็น DynamicModule ด้วย เพราะว่าเราต้องการให้ register() ส่ง Module ที่ถูกตั้งค่าใหม่กลับมา
  // ตัวอย่างการสร้าง register เช่น static register(options: SomeInterface): DynamicModule { ... }
  static register(options: DynamicModulesChapterInterface): DynamicModule {
    // เราต้องการที่จะ return DynamicModule กลับมา ซึ่งมันก็คือ @Module() ที่ถูกตั้งค่าขึ้นมาใหม่
    // ดังนั้นเราจะต้อง return object ที่มี module: ModuleClass เสมอ
    // เช่น return { module: SomeModule, ... }
    // โดยเราจะสามารถใส่ controllers, providers, imports, exports ได้เหมือน @Module() เลย
    // ส่วนข้อมูลที่เข้ามาก็ให้เราไปประกาศ custom provider เอาไว้ด้วย เพื่อให้สามารถ inject ไปใช้งานได้
    // หลังจากเขียน return Module นี้ก็จะพร้อมถูกเรียกใช้งานแล้ว สามารถอ่านได้ที่ dynamic-modules-chapter.module.ts
    return {
      module: DynamicModulesChapterDynamicModule,
      controllers: [DynamicModulesChapterController],
      providers: [
        DynamicModulesChapterService,
        { provide: 'REGISTER_OPTIONS', useValue: options },
      ],
      exports: [DynamicModulesChapterService],
    };
  }

  static registerAsync(): DynamicModule {
    return {
      module: DynamicModulesChapterDynamicModule,
      controllers: [DynamicModulesChapterController],
      providers: [
        DynamicModulesChapterService,
        { provide: 'REGISTER_OPTIONS', useFactory: async () => {} },
      ],
      exports: [DynamicModulesChapterService],
    };
  }
}
