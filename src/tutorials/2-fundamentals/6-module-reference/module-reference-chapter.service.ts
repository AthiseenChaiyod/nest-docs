import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ModuleReferenceChapterServiceB } from './module-reference-chapter.service-b';
import { ModuleReferenceChapterServiceC } from './module-reference-chapter.service-c';

@Injectable()
export class ModuleReferenceChapterService {
  // โดยปกติแล้วเราจะต้อง inject provider เข้ามาก่อนจึงจะสามารถใช้งานมันได้
  // ซึ่งวิธีแบบนี้ก็คือการประกาศเอาไว้ตรง ๆ เลย ไม่สามารถเปลี่ยนแปลงแก้ไขได้ (static)
  // จะทำยังไงในกรณีที่เรามีข้อมูล boolean มาแล้วเราอยากใช้ service นี้ถ้าเป็น true อีก service ถ้าเป็น false
  // ปัญหานี้จะแก้ได้ด้วย ModuleRef
  // ให้เรานึกภาพว่าแทนที่เราจะ inject มาทีละตัว เราก็จะไปค้นจาก Module โดยตรงไปเลย
  // จะทำให้เราเขียน condition ได้โดยที่ไม่ต้อง inject provider 2 ตัวเข้ามาแล้ว if else เอา
  // เช่น สมมติว่ามี service A, B แล้วเรามีค่า disabled ที่เป็น boolean เข้ามา
  // เราอยากให้ A ทำงานถ้า disabled เป็น true, B ทำงานถ้าเป็น false
  // ถ้าเป็นปกติเราก็จะต้อง inject ทั้ง A, B เข้ามาก่อน ไม่งั้นเราจะเรียกใช้ A, B ไม่ได้
  // แต่ถ้าเราใช้ ModuleRef เราก็สามารถไปเรียกใช้ Service A, B ได้เลยโดยที่ไม่ต้อง Inject
  // เช่น disabled ? this.moduleRef.get(ServiceA).hello() : this.moduleRef.get(ServiceB).hi()
  // เท่านี้เราก็สามารถเรียกใช้ service ได้แบบ dynamic ไม่ต้องประกาศเอาไว้ล่วงหน้าแล้ว
  // แต่ว่าทั้งจุดที่เราเรียกใช้ ModuleRef และ provider ที่เราจะค้นหาก็ต้องอยู่ใน Module เดียวกันด้วย
  // ถ้าไม่อย่างนั้นจะหากันไม่เจอ
  // วิธีการสร้าง อันดับแรกก็ให้เรา inject ModuleRef เข้ามาก่อน
  constructor(private moduleRef: ModuleRef) {}

  getIndex() {
    return `This is Module Reference page!`;
  }

  // ต่อมาเราก็จะเรียกข้อมูลของ provider
  // โดยเราจะมี 2 ตัวเลือก คือ ใช้ .get() และใช้ .resolve()
  // .get() จะใช้ในกรณีที่เราเรียก provider ที่เป็น Scope.DEFAULT
  // .resolve() จะเอาไว้ใช้ในกรณีที่เป็น Scope.REQUEST และ Scope.TRANSIENT
  // สำคัญคือ .resolve() จะส่ง type Promise กลับมา ดังนั้นเราก็ควรที่จะแปะ await เอาไว้ด้วยเสมอ
  // โดยทั้ง 2 method จะรับค่า class หรือ Token ของ provider ที่จะค้นหา
  // และยังสามารถใส่ config object ตามหลังไปได้ด้วย
  // โดย config object จะมีหน้าตา { strict: boolean } เช่น { strict: false }
  // strict จะเป็นตัวที่บอกเราว่า การค้นหา provider นี้จะค้นหานอก Module ตัวเองหรือไม่
  // เช่น เราอยากค้นหา AppService ที่อยู่ด้านนอก เราก็จะใส่ .get(AppService, { strict: false })
  // หากเราไม่ได้ใส่ config object มา ก็จะถือว่ามี strict: true เลย (เป็นค่า default)
  getInfo() {
    return this.moduleRef.get(ModuleReferenceChapterServiceB).getValue();
  }

  // แต่ถ้าเกิดเราจะเรียกใช้ provider ที่ไม่ได้ถูกระบุเอาไว้ใน Module เราต้องใช้ .create() แทน
  // .create() จะทำหน้าที่คล้าย ๆ กับการ inject provider เข้ามาให้ใช้งาน
  // สมมติ เรามี CatsService อยู่ตัวนึง แล้วเราอยากจะเอามาใช้ในนี้
  // เราไม่สามารถ .get(), .resolve() ได้ถ้าไม่ใช้ { strict: false }
  // แต่เราสามารถตั้งให้ตัวแปรของเรามีค่าเท่ากับ instance ของ CatsService ได้จาก .create()
  // ให้เราสร้างตัวแปรเอาไว้ข้างนอก Method หนึ่งตัวเพื่อที่เราจะได้ใส่ค่า instance ให้กับมันได้
  // แล้วจึงใช้ onModuleInit() { ... } ที่จะทำงานอัตโนมัติในการใส่ค่า instance ให้กับตัวแปรที่เตรียมไว้
  // และด้วยความที่ .create() ส่งค่า Promise<T> กลับมา เราก็ต้องแปลงโค้ดเราให้เป็น async ด้วย
  serviceC: Promise<ModuleReferenceChapterServiceC>;
  onModuleInit() {
    this.serviceC = this.moduleRef.create(ModuleReferenceChapterServiceC);
  }
  async getValue() {
    let value: string;

    await this.serviceC.then((service) => {
      value = service.getValue();
    });

    return value;
  }
}
