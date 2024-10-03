import { InjectionScopesChapterDefaultService } from './services/injection-scopes-chapter.default-service';
import { InjectionScopesChapterRequestService } from './services/injection-scopes-chapter.request-service';
import { Controller, Get, Scope } from '@nestjs/common';
import { InjectionScopesChapterTransientService } from './services/injection-scops-chapter.transient-service';

// เราสามารถนำ Scope มาแปะไว้ที่ Controller ได้เหมือนกัน แต่จะแปะได้แค่สองตัว คือ DEFAUT, REQUEST
// จากที่เราเคยสร้าง Controller มา ทุกตัวจะเป็น DEFAULT
// กล่าวคือข้อมูลข้างใน Instance จะถูกแชร์ให้กับ Request ที่เข้ามาทั้งหมด
// แต่ถ้าเกิดเราประกาศ Scope.REQUEST เอาไว้ข้างใน instance จะถูกสร้างขึ้นใหม่ทุกครั้ง
// ง่าย ๆ ก็คือค่าทุกอย่างใน Controller จะถูก reset และนำมาใช้ใหักับแต่ละ Request เป็นคนละตัวกัน
// สามารถประกาศ scope ได้ง่าย ๆ เพียงเปลี่ยนจากตอนแรกที่เรารับ string เปล่า ๆ เป็น object แทน
// โดยข้างใน object จะมี madatory คือ path ที่จะรับค่า string path เหมือนกับที่เราประกาศใน () ปกติ
// ให้คั่นด้วย , แล้วประกาศ scope: Scope.SOMETHING ได้เหมือนตอนเราประกาศใน @Injectable() เลย
// เช่น @Controller({ path: 'some-where', scope: Scope.DEFAULT })
@Controller({ path: 'injection-scopes' })
export class InjectionScopesChapterController {
  constructor(
    private defaultService: InjectionScopesChapterDefaultService,
    private requestService: InjectionScopesChapterRequestService,
    private transientService: InjectionScopesChapterTransientService,
  ) {}

  // ถ้าเป็น DEFAULT ไม่ว่าเราจะกดส่ง request มากี่ตัว ทุก request จะเข้าถึง counter ล่าสุดได้เสมอ
  // แต่ว่าถ้าเป็น REQUEST เราจะได้ 0 กลับไปตลอด เพราะว่าเราสร้าง Controller ใหม่ให้กับ Request นั้น ๆ
  counter: number = 0;
  @Get()
  getIndex() {
    return `counter: ${this.counter++}`;
  }

  @Get('default')
  getDefaultValue() {
    return this.defaultService.getValue();
  }

  @Get('request')
  getRequest() {
    return this.requestService.getIndex();
  }

  @Get('transient')
  getTransientValue() {
    return this.transientService.getValue();
  }
}
