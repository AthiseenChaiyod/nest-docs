import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER, REQUEST } from '@nestjs/core';
import { Request } from 'express';

// Scope ต่อมาที่เราจะพูดถึงคือ REQUEST Scope หรือ Scope.REQUEST
// Scope นี้จะสร้าง instance ของตัวเองก็ต่อเมื่อมี Request ใด ๆ เข้ามาเท่านั้น
// และจะทำลายตัวเองลงหาก Request นั้นไม่ได้ทำงานแล้ว เมื่อถูกทำลายก็จะเก็บเอาไว้แบบ Garbage Collected
// ให้ระวังการที่เราจะนำ REQUEST ไป inject ใส่ DEFAULT มันจะทำการ Override Scope ทันที
// กล่าวคือจากตอนแรกที่เป็น DEFAULT ถ้า inject REQUEST มาเมื่อไรก็จะกลายเป็น REQUEST ไปด้วย
// ในการสร้าง durable provider เราก็จะประกาศ durable: true เอาไว้ด้วย
// โดย durable provider นั้นจะต้องเป็น REQUEST scope เสมอ
// ถ้าเรา inject request scope เข้ามาในโค้ดเราแล้ว เราก็ไม่ต้องประกาศ Scope.REQUEST ก็ได้
@Injectable({ scope: Scope.REQUEST, durable: true })
export class InjectionScopesChapterRequestService {
  constructor(
    // ใน REQUEST Scope ที่จะสร้าง instance แยกกันแต่ละ Request ก็เลี่ยงไม่ได้ที่จะดึงข้อมูลของ Request
    // ดังนั้นให้เราใช้ @Inject(REQUEST) เพื่อดึงข้อมูลออกมา (ในกรณีที่เราไม่ได้ทำผ่าน Controller)
    // ถ้าเราทำ RPC ก็ให้ใช้ @Inject(CONTEXT) โดยไม่ประกาศ type แทน
    // เช่น @Inject(CONTEXT) private rpcContext
    @Inject(REQUEST) private request: Request,

    // หรือจะดึงข้อมูลของ class comsumer ก็ได้ ว่า method นี้ไปอยู่ใน class ไหน
    // ทำได้ผ่านการใช้ @Inject() เช่นเดิม แต่จะใช้ INQUIRER แทน
    // return type ให้ใช้เป็น object เพราะว่าเราจะ return type ของ class กลับมา
    // เช่น @Inject(INQUIRER) private classConsumer: object
    // แต่ว่าตอนนำไปใช้งานให้เรา . หาสิ่งที่เราอยากได้เอาเองด้วย ไม่อย่างนั้นเราจะได้แค่ {} เปล่ากลับไป
    // เช่น เราอยากรู้ชื่อ class ก็ใช้ .constructor.name
    @Inject(INQUIRER) private classConsumer: object,
  ) {
    console.log(`Scope.REQUEST created!`);
  }

  getIndex() {
    return `This is Scope.REQUEST!`;
  }

  // ในการทดสอบเราจะใช้ Math.random เพื่อสร้างตัวเลขแบบสุ่มขึ้นมา
  // ทุกครั้งที่เรากดส่ง Request ไปใหม่ตัวเลขนี้ก็จะเปลี่ยนเสมอ
  serviceId = Math.random();
  getServiceId() {
    return this.serviceId;
  }

  // method นี้จะเอาไว้ใช้ทดสอบการดึงข้อมูล Request จาก @Inject()
  getRequest() {
    return this.request.body;
  }

  // และ method นี้จะเอาไว้ใช้ทดสอบ @Inject(INQUIRER)
  getConsumer() {
    return this.classConsumer.constructor.name;
  }
}
