import { DynamicModule, Module } from '@nestjs/common';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from './configurable-module.dynamic-module';
import { ConfigurableModuleController } from './configurable-module.controller';
import { ConfigurableModuleService } from './configurable-module.service';

// วิธีการสร้าง Module อีกแบบก็คือใช้ ConfigurableModuleBuilder ที่เป็น built-in ของ NestJS
// ใน NestJS Docs บอกไว้ว่าการสร้าง Dynamic Module เองซับซ้อน ใช้ built-in สร้างง่ายกว่า
// แต่เอาเข้าจริง ๆ รู้สึกว่าสร้างเองง่ายกว่า โค้ดเขียนเป็นระเบียบกว่าด้วย
// เริ่มต้นการสร้างเหมือนกันเลย คือการสร้าง Module เปล่าขึ้นมาก่อนหนึ่งตัว
// การที่เราจะทำให้ Module นี้เป็น Dynamic ได้ก็จะต้องไปสร้าง instance ขึ้นมาใหม่ด้วย ConfigurableModuleBuilder ก่อน
// ณ ตอนนี้ให้คิดซะว่า Module นี้เป็น module เปล่า แล้วอ่านต่อได้ที่ configurable-module.dynamic-module.ts
@Module({
  controllers: [ConfigurableModuleController],
  providers: [ConfigurableModuleService],
  exports: [ConfigurableModuleService],
})
// การ extends ConfigurableModuleClass มาก็เท่ากับมันจะเป็น Dynamic Module แล้ว
// พร้อมทั้งมี register(), registerAsync() ให้ใช้เรียบร้อยไม่ต้องเขียนเอง
// แต่ใน manual เราจะประกาศ controllers, providers, imports, exports ตรง return { } ของ static register()
// หากเราใช้ built-in เราสามารถประกาศเอาไว้ใน @Module({}) ได้เลยเหมือน Module ปกติ
// แล้วเราก็สามารถนำ Module นี้ไปใช้ใน imports ได้แล้ว
export class ConfigurableModule extends ConfigurableModuleClass {
  // อีกเรื่องที่ไม่พูดไม่ได้ก็คือเรื่องของการ override static method ของ ConfigurableModuleClass
  // หากเราต้องการที่จะจัดการเพิ่มเติมใน static method เราก็สามารถ override ได้
  // เพียงเขียน method ขึ้นมาใหม่ใน Module ที่ extends มาจาก ConfigurableModuleClass
  // ต่างกันแค่เพียง type ของ parameter ที่เราจะรับเข้ามา
  // เราจะต้องไป destructuring ข้อมูลมาเพิ่มเติมจาก ConfigurableModuleBuilder()
  // ตัวแรกคือ OPTIONS_TYPE ที่จะเอาไว้แทน type ของข้อมูลที่เรารับเข้ามาใน Module
  // ตัวที่สองคือ ASYNC_OPTIONS_TYPE ที่จะแทน type ของข้อมูลที่รับมาเหมือนกันแต่จะใช้ใน async method แทน
  // อย่าลืมที่จะใส่ typeof ให้กับ OPTIONS_TYPE / ASYNC_OPTIONS_TYPE เอาไว้ด้วย
  // เนื่องจากเราไม่ได้เอาตัว object นั้น แต่เอาแค่ type ของมัน
  // เสร็จแล้วตอน return เราก็จะต้องส่งค่า Dynamic Module object กลับมาปกติเหมือนตอนสร้าง manual
  // แต่ให้เราใช้ spread operator ร่วมกับ super เพื่อเข้าถึง parent method แทน
  // เช่น ...super.forFeature(options) ซึ่งก็คือการใช้ parent forFeature() สร้าง object ตัวเองขึ้นมาใหม่นั่นแหละ
  // แต่เราจะสามารถเขียนโค้ดอื่น ๆ ข้างในนี้ได้ ไม่ใช่แค่ return เฉย ๆ
  static forFeature(options: typeof OPTIONS_TYPE): DynamicModule {
    return {
      ...super.forFeature(options),
    };
  }

  static forFeatureAsync(options: typeof ASYNC_OPTIONS_TYPE) {
    return {
      ...super.forFeatureAsync(options),
    };
  }
}
