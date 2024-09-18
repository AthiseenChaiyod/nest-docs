import { Controller, Get, HostParam } from '@nestjs/common';

// สุดท้ายนี้ เราสามารถกำหนดให้ Controller รับเฉพาะ Request จาก Domain เฉพาะได้
// โดยเราจะใส่ object ที่มี property host: string เพื่อที่จะเอาไว้ระบุ Domain
// ถ้าไม่ใช่จาก Domain ที่เราระบุไว้ Request ใด ๆ จะถูกปัดทิ้งทั้งหมด
@Controller({ host: 'localhost:3000' })
export class SubDomainRouting {
  @Get()
  findIndex() {
    return;
  }
}

// โดยเราสามารถใช้ : เพื่อ extract ข้อมูลได้ แต่เราจะใช้ @HostParam() แทน @Param()
@Controller({ host: ':account.localhost:3000' })
export class SubDomainRoutingHostParam {
  @Get()
  findIndex(@HostParam('account') account: string) {
    return `Host Param: ${account}`;
  }
}
