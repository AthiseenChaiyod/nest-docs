import { Injectable } from '@nestjs/common';
import { LazyModuleLoader } from '@nestjs/core';

// ทำไมเราจะต้องทำ Lazy-loading?
// บางครั้ง Application เราอาจจะใหญ่ การที่จะสร้าง instance ตู้มเดียวทั้งหมดเลยก็คงนาน
// เราเลยจะต้องเก็บบางส่วนเอาไว้สร้างเฉพาะตอนที่ถูกเรียกใช้งานเท่านั้น
// การโหลดแค่ instance ที่จำเป็นก่อนจะทำให้ Application เราโหลดไวขึ้น
// แถมการทำ Lazy-loading ก็สามารถนำไปทำการ load ข้อมูลแบบ Dynamic ได้ด้วย
// เพราะว่าเราไม่ได้โหลดอะไรไปตายตัว ทำให้เมื่อถูกใช้เราก็สามารถเลือกได้ว่าจะโหลดอะไรไปให้ใช้
// ใด ๆ ก็ตาม ห้ามทำ lazy-loading ให้กับ Controller เด็ดขาด
// เพราะว่า router ไม่สามารถทำงานตอน runtime ได้
// การทำ lazy-loading จะเหมาะกับอะไรที่ต้องการความเร็วมาก ๆ และการเขียนที่ไม่เป็นระเบียบจะทำให้ประสิทธิภาพลดได้
@Injectable()
export class LazyLoadingModulesChapterService {
  // โดยเราจะ inject LazyModuleLoader มาก่อน เพื่อที่เราจะได้ใช้คำสั่ง .load() ในการ lazy-loading ได้
  // ซึ่ง .load() จะรับค่า Factory 1 ตัว (arrow function นั่นแหละ)
  // โดยข้างใน Factory จะต้องส่งค่า Module ที่เราจะ Lazy-loading กลับมา
  // เช่น this.lazyModuleLoader.load(() => SomeModule)
  // อีกเรื่องสำคัญคือการใช้ .load() จะ cache Module ของเราเอาไว้ด้วย
  // ทำให้การโหลดครั้งต่อ ๆ ไปจะไวมาก
  // และการ lazy-loading จะไม่ trigger Lifecycle hooks ที่เขียนเอาไว้ในนั้นด้วย (สำคัญ)
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  // แต่ว่าก็ไม่ใช่จะใส่ load(() => ...Module) ไปแล้วก็ได้เลย
  // เราจะทำให้ Module ของเราเป็น Module ที่พร้อมจะ lazy-loading ด้วย
  // โดยเราจะต้อง destructuring มันออกมาจาก await import(path)
  // ให้คิดซะว่าเป็นการ imports สิ่งที่เราอยากได้ในบรรทัดนี้แทนที่จะเป็นบรรทัดบนสุด
  // โดยเราสามารถ import ได้โดยใช้ function import() ที่จะรับค่า string path 1 ตัว
  // เช่น import('./some-module.module.ts')
  // ทำให้เราไม่ต้องไปประกาศไว้ข้างบนสุด เช่น import { SomeModule } from './some-module.module.ts'
  // แต่ไม่ใช่แค่ import() แล้วก็จะนำไปใช้ได้เลย เพราะว่าเรายังไม่ได้บอกเลยว่า import อะไร
  // ให้เรา destructuring สิ่งที่เราต้องการออกมาจาก import() ด้วย
  // แล้วก็ด้วยความที่เราต้องรอ import เสร็จก่อนแล้วค่อย destructuring เราเลยต้องใช้ await เพื่อรอผลลัพธ์
  // ตัวอย่างการ import เช่น const { SomeModule } = await import('./some-module.module.ts')
  // เราก็จะได้ SomeModule ที่ถูก import มาเรียบร้อยแล้ว เราจึงค่อยนำโหลดใน Factory ของ .load() ได้
  // เช่น const someModule = this.lazyModuleLoader.load(() => SomeModule)
  // การที่เราใส่ค่าไปในตัวแปรด้วยก็เหมือนกับการสร้าง instance ให้กับ Module โดยไม่ต้อง inject เข้ามา
  // ซึ่ง .load() ก็จะส่งค่า Promise<ModuleRef> กลับมา ทำให้เราจะต้องเขียนโค้ดแบบ Async
  async useLazyLoad() {
    const { LazyLoadingModulesProviderModule } = await import(
      './lazy-loading-modules-provider/lazy-loading-modules-provider.module'
    );
    const lazyModule = this.lazyModuleLoader.load(
      () => LazyLoadingModulesProviderModule,
    );
    // ส่งค่า Promise instance กลับไป
    return lazyModule;
  }
}
