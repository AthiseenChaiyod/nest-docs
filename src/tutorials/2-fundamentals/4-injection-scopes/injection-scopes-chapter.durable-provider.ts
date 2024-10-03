import {
  ContextId,
  ContextIdFactory,
  ContextIdStrategy,
  HostComponentInfo,
} from '@nestjs/core';
import { Request } from 'express';

// สิ่งแรกที่เราจะต้องพูดถึงก่อนก็คือ durable provider คืออะไร?
// เมื่อเราพูดถึง Scope.REQUEST แล้ว เราก็จะต้องสร้าง instance หนึ่งตัวต่อหนึ่ง request
// แล้วเราสมมติว่ามีคน 10 คนเข้าใช้งาน เราก็ต้องสร้าง instance 10 ตัว ซึ่งก็ปกติดี
// แต่ว่าถ้า 10 คนเดิมเข้าใช้งาน ทำไมเราจะต้องสร้างอีก 10 instance ใหม่ด้วย
// เพราะบางคนที่เข้าใช้อาจจะตั้งค่าเฉพาะของตัวเองไว้ ถ้ากลับมาอีกครั้งแล้วตั้งค่าหาย ใครจะไปอยากใช้ต่อ
// เหตุผลนี้เองที่ทำให้เราต้องมี durable provider ที่เอามาใช้เก็บ instance พออยากใช้ค่อยดึงมาใช้
// ทำให้เราไม่ต้องโหลดใหม่ และข้อมูลก็อยู่ครบด้วย
// ส่วนวิธีสร้าง อันดับแรกให้เราสร้างตัวแปรเอาไว้เก็บข้อมูลของ DI sub-tree จำลองขึ้นมาก่อน
// อารมณ์ประมาณว่าเราสร้าง array เก็บข้อมูลสำหรับทดสอบ POST นั่นแหละ ถ้ามีที่เก็บอื่นค่อยไปสร้างตรงนั้นแทน
// แล้วทำไมเราจะต้องเก็บ string, ContextId เอาไว้ใน Map()?
// ประมาณว่าเราจะใช้ string ที่เราส่งมาทำหน้าที่เหมือน username ที่จะยืนยันตัวตนให้กับ request นั้น ๆ
// และเราจะใช้ ContextId ทำหน้าที่เหมือนหมายเลขกล่องที่จะเก็บข้อมูลของ request นั้นเอาไว้
// ถ้าเกิดเราส่ง string ตัวเดิมมา ทีนี้เราก็สามารถที่จะส่งกล่องข้อมูลเดิมกลับไปได้อย่างถูกต้อง
const tenants = new Map<string, ContextId>();

// ต่อมาเราก็จะ implements ContextIdStrategy ที่จะเอาไว้ใช้สร้าง DI sub-tree
// การ implements ContextIdStrategy จะบังคับให้เราต้องมี attach() เสมอ
export class DurableProvider implements ContextIdStrategy {
  // โดย attach() จะรับ parameter 2 ตัว
  // ตัวแรก type ContextId เป็นค่าที่เราจะเอาไว้แปะกล่องข้อมูลของ Request นั้น
  // ตัวที่สอง type Request<express> ที่จะเป็นตัวแทนของ Request ให้เรา extract ข้อมูลออกมา
  attach(contextId: ContextId, request: Request) {
    // ต่อมาเราก็จะดึงข้อมูล x-tenant-id จาก header ของ request ที่เข้ามา
    // จะเป็นชื่ออื่นก็ได้ เราแค่ต้องการให้ส่งมาเพื่อที่จะได้เอาไว้ระบุว่า request เดิมหรือเปล่าที่เข้ามา
    // ซึ่งเราก็ต้องใส่ x-tenent-id มาเองใน request header เพื่อที่เราจะได้ดึงข้อมูลมาใช้ได้
    // เราจะ extract ออกมาด้วยการใช้ .get(string) ใส่ request
    // แล้วเราก็จะนำไปเก็บเอาไว้ในตัวแปร เพื่อใช้ต่อในอนาคต
    const tenantId = request.get('x-tenant-id');

    // ต่อมาก็สร้างตัวแปรรอรับค่า sub-tree ที่สร้างใหม่
    // ซึ่งก็คือเลขกล่องที่เก็บข้อมูล Request ของเราเอาไว้
    let tenantSubTreeId: ContextId;

    // ต่อมาเราก็จะเช็คว่า header ที่เราส่งมาเราเคยส่งมาแล้วหรือยัง โดยหาจากใน Map()
    // ถ้าเจอตัวซ้ำแปลว่าเราเคยส่งข้อมูลมาแล้ว มันก็จะมีข้อมูล request ของมันถูกเก็บเอาไว้อยู่
    // เราก็จะเก็บหมายเลข request ของมันเอาไว้ใช้ต่อในอนาคต
    if (tenants.has(tenantId)) {
      tenantSubTreeId = tenants.get(tenantId);
    }
    // ถ้าไม่เจอ header ที่เราส่งมาก็แปลว่าเราเพิ่งเคยส่ง string นี้มาเป็นครั้งแรก เราจะสร้างข้อมูลให้มันใหม่
    // เราก็จะ generate ContextId ขึ้นมาใหม่อีกครั้งและใส่เข้าไปใน Map ด้วย .set()
    else {
      tenantSubTreeId = ContextIdFactory.create();
      tenants.set(tenantId, tenantSubTreeId);
    }

    // ก่อนที่เราจะมาพูดเรื่องการส่งค่ากลับ เราจะต้องพูดถึงการสร้าง instance ของ request scope ก่อน
    // ไม่อย่างนั้นเราจะงงว่าทำไมต้องส่งค่านี้กลับ
    // อันดับแรก เวลาที่มี Request เข้ามาใน Application NestJS ก็จะสร้าง ContextId ให้กับ Request นั้นเสมอ
    // กระบวนการพวกนี้เราจะไม่เห็นหรือไม่รู้เรื่องอะไรของมันเลย
    // การมี ContextId นั่นคือสาเหตุที่ว่าเราสามารถสร้าง instance ให้กับทุก Request ได้ใน Request Scope
    // ในเชิงทฤษฎีแล้ว เราสามารถใช้ ContextId เพื่อเข้าถึง Instance ของ Request นั้นได้โดยตรงเลย
    // โดยปัญหาหลักของเราก็คือแล้วเราจะรู้ได้ยังไงว่าเราจะต้องสร้าง instance ใหม่หรือว่าสร้างโดยใช้ ContextId ปกติ
    // นั่นคือสาเหตุที่เราต้องมี durable: true
    // เพื่อบอกว่า Service นี้เราจะสร้าง Instance ต่อ Request นะ แล้วถ้าตัวซ้ำก็ใช้ Instance เดิมไป
    // การที่เราใช้ HostComponentInfo ก็เพราะว่าจะเข้าถึง durable ที่เราประกาศเอาไว้
    // ถ้าเป็น true แปลว่าเราจะต้องส่งค่า SubTreeId กลับ (เป็นค่า Id ที่ใช้ระบุตัวตนของ Request)
    // ถ้าเป็น false แปลว่าเราจะไม่ได้ใช้ instance เดิม ให้เราสร้างใหม่ได้เลย
    // สรุปแล้ว durable ก็มีไว้ใช้แค่เอามาเป็น condition ว่าจะส่งค่าอะไรกลับไปเท่านั้น
    // ไม่ว่าเราจะส่งค่า SubTreeId ไปหรือว่าส่ง ContextId ไป NestJS ก็จะใช้มันสร้าง instance อยู่ดี
    // แตกต่างกันแค่ SubTreeId เราจดเอาไว้แล้ว กับ ContextId เราไม่ได้จดเอาไว้
    // ทำให้เราสามารถเข้าถึง SubTreeId ที่เป็น instance ตัวเดิมซ้ำหลาย ๆ รอบได้
    // แต่ว่ากับ ContextId เราปล่อยผ่านไปเลย
    // ส่วน payload ก็คือกล่องเก็บข้อมูลเฉพาะของ Instance นั้น ๆ นั่นแหละ
    // จะเก็บในรูปแบบ object เก็บอะไรก็ได้
    return {
      resolve: (info: HostComponentInfo) =>
        info.isTreeDurable ? tenantSubTreeId : contextId,
      payload: { tenantId },
    };
  }
}
