import { ConfigurableModuleBuilder } from '@nestjs/common';
import {
  ConfigurableModuleExtraInterface,
  ConfigurableModuleInterface,
} from './configurable-module.interface';

// ในการสร้าง Dynamic Module ด้วย ConfigurableModuleBuilder นั้นต่างกับวิธีการสร้าง static method อย่างชัดเจน
// กล่าวคือในขั้นตอนนี้เราจะต้องสร้าง instance ใหม่ของ ConfigurableModuleBuilder ขึ้นมาก่อน
// แล้วเราจึงจะค่อย destructuring ข้อมูลสำคัญออกมาจาก instance ของ class นี้เพื่อที่จะนำไปใช้กับที่อื่น ๆ ต่อไป
// ใด ๆ ก็ตามเราจะต้องสร้าง instance ขึ้นมาก่อนที่จะทำ destructuring เพื่อความถูกต้องแม่นยำ
// อ่านตรง new ConfigurableModuleBuilder<T>() ด้านล่างก่อนค่อยมาอ่านต่อตรงนี้
export const {
  // ตัวแรกสุดคือ ConfigurableModuleClass ที่เราจะต้องนำไป extends ให้กับ Module เปล่าในตอนแรกของเรา
  // แค่ extends ConfigurableModuleClass Module เปล่าของเราก็จะกลายเป็น Dynamic Module เลย
  // มี register(), registerAsync() ให้พร้อมเสร็จสรรพ
  ConfigurableModuleClass,

  // ตัวต่อมาคือ MODULE_OPTIONS_TOKEN ที่จะเป็น token ตัวแทนของข้อมูลที่เรารับเข้ามา
  // เหมือนกับตอนที่เรารับข้อมูลเข้ามาแล้วก็นำไปสร้างเป็น custom provider ใหั Dynamic Module นั่นแหละ
  // เราจะใช้ชื่อ token ว่า MODULE_OPTIONS_TOKEN แทน
  MODULE_OPTIONS_TOKEN,

  // OPTIONS_TYPE, ASYNC_OPTIONS_TYPE จะเกี่ยวข้องกับการ override static method ของ Dynamic Module
  // เราจะต้อง destructuring ทั้งสองตัว เพื่อที่จะนำไปเป็น type ของ parameter ให้กับ overridden method
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} =
  // เราจะไม่สามารถ destructuring ได้อย่างถูกต้องเลยถ้าไม่สร้าง instance เอาไว้ก่อน (จะได้ดูได้ว่ามีอะไรบ้าง)
  // ให้เราใช้ keyword new กับ ConfigurableModuleBuilder() และปิดท้ายด้วย .build() เพื่อสร้าง instance ใหม่
  // ตอนนี้เราก็มี instance แล้ว แต่เราสามารถใส่ข้อมูลอะไรมาเป็น add-on ก็ได้ ซึ่งเราไม่อยากให้เป็นอย่างนั้น
  // อารมณ์ประมาณว่าเรากำหนด argument options ของ static register() ให้เป็น any นั่นแหละ
  // เราก็เลยต้องสร้าง interface มาแปะเอาไว้เหมือนกัน แต่ว่าจะแปะผ่าน Generics แทน
  // เช่น new ConfigurableModuleBuilder<SomeInterface>().build()
  // เท่านี้เราก็จะได้ instance ของ ConfigurableModuleBuilder ที่พร้อมจะถูก destructuring ไปใช้งานแล้ว
  // ให้เรา extends Module เปล่าของเราด้วย ConfigurableModuleClass เพื่อแปลงมันให้เป็น Dynamic Modue
  // อ่านต่อได้ที่ configurable-module.module.ts
  new ConfigurableModuleBuilder<ConfigurableModuleInterface>()
    // อย่างที่กล่าวไปว่าการสร้าง Dynamic Module เองแบบ manual จะทำให้เราสามารถตั้งชื่อ static method ของเราได้
    // แบบ built-in ก็สามารถทำได้เช่นกันโดยการใช้คำสั่ง .setClassMethodName() ที่จะรับค่า string 1 ตัว
    // โดย .setClassMethodName() จะเปลี่ยนชื่อของ register(), registerAsync() เป็น string ที่เรากำหนด
    // เช่น .setClassMethodName('something') ก็จะได้ something(), somethingAsync() มาแทน
    // ตอนเราเรียกใช้ตรง imports แทนที่จะ .register({ ... }) ก็ .something({ ... }) แทน
    .setClassMethodName('forFeature')
    // เหมือนกันกับ .setFactoryMethodName() ที่จะรับ string 1 ตัวเหมือนกัน แต่จะใช้กับ useClass, useExisting เป็นหลัก
    // อย่างที่เราสร้างใน manual ตอนเราสร้าง custom provider เราจะใช้ useValue เพื่ออ้างอิงถึง object options ที่ส่งเข้ามา
    // แต่ว่าใน registerAsync() ที่เราจะต้องเขียน async function เอง เราจะใช้ useFactory: async () => { ... }
    // ถ้าเกิดเรามี class / instance ที่มี function ในการกำหนดค่าอยู่แล้ว เราก็สามารถใช้ useClass / useExisting ได้เลย
    // แล้วก็ให้ใช้ .setFactoryMethodName() เพื่อระบุว่าให้ไปใช้ method ชื่อที่กำหนดใน class / instance นั้น ๆ เพื่อตั้งค่านะ
    // เช่น สมมติว่ามี SomeClass ที่มี method UserConfig() { ... } อยู่
    // และเราเขียน .setFactoryMethodName('UserConfig')
    // จะเป็นการบอกว่าเราจะใช้ return value ของ method นั้นเป็นค่าให้กับ registerAsync() แทน
    // ข้อควรระวังคือ ถ้าเกิดเราไม่ได้ระบุ .setFactoryMethodName() NestJS จะมองหา create() ในการสร้างข้อมูล
    // ซึ่ง useFactory() จะบอกว่าไม่ต้องมองหา create() แล้ว ให้ใช้ useFactory นี่แหละ
    // แต่ถ้าเราระบุ .setFactoryMethodName() เราจะต้องใช้ useClass / useExisting เพื่อระบุหา method นั้น ๆ โดยตรง
    .setFactoryMethodName('UserConfiguration')
    // ตัวสุดท้ายคือ .setExtras() ที่จะเอาไว้เพิ่มข้อมูลที่เราไม่ได้ระบุเอาไว้ใน interface เข้ามา
    // เราสามารถกำหนด type ให้กับข้อมูลที่จะส่งเข้ามาใน .setExtras() ได้เหมือนกัน โดยใช้ Generics แปะเอาไว้
    // เช่น .setExtras<SomeInterface>();
    // โดย .setExtras() จะรับ parameter 2 ตัว
    // ตัวแรกคือ object ของข้อมูลที่เราจะส่งมาเพิ่มเติม เช่น { name: 'athiseen', age: 25 }
    // ส่วนตัวที่สองคือ arrow function ที่จะจัดการเรื่องของ instance Dynamic Module ของเรากับข้อมูลที่รับมาจาก .setExtras()
    // โดย arrow function จะรับ parameter 2 ตัว ให้เราใส่มาแค่ชื่อที่เราจะตั้งตามลำดับก็พอ
    // ตัวแรกจะเป็น instance Dynamic Module ของเรา
    // ตัวที่สองจะเป็น object ข้อมูลทั้งหมดที่ได้จาก .setExtras() และการส่งข้อมูลมาจาก imports
    // โดยการส่งข้อมูลกลับให้ส่งกลับมาในรูปของ object
    // เช่น (moduleInstance, extraObject) => { return { ... } } เพื่อที่เราจะได้นำไป .build() ต่อไป
    // เปรียบเทียบง่าย ๆ เรามีข้อมูลครบแล้ว ก็อยู่ที่เราว่าอยากได้ Dynamic Module หน้าตาแบบไหนค่อย return ไปให้ .build()
    .setExtras<ConfigurableModuleExtraInterface>(
      {
        first_name: 'Paemika',
        last_name: 'Jantawong',
        age: 34,
        gender: 'female',
      },
      (moduleOptions, extraOptions) => {
        return { ...moduleOptions };
      },
    )
    .build();
