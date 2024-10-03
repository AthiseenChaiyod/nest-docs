import { Controller, Get } from '@nestjs/common';
import { InjectionScopesChapterDefaultService } from '../services/injection-scopes-chapter.default-service';
import { InjectionScopesChapterTransientService } from '../services/injection-scops-chapter.transient-service';

@Controller('second-controller')
export class InjectionScopesChapterSecondController {
  constructor(
    private defaultService: InjectionScopesChapterDefaultService,
    private transientService: InjectionScopesChapterTransientService,
  ) {}
  @Get()
  getIndex() {
    return `This is index page!`;
  }

  // เอาไว้ใช้ทดสอบว่าเวลาเรียก .getValue() แล้วจะได้ค่าเดียวกันหรือไม่
  @Get('default')
  getDefaultValue() {
    return this.defaultService.getValue();
  }

  // เอาไว้ใช้ทดสอบว่าเวลาเรียก .getValue() แล้วจะได้ค่าคนละตัวกันหรือไม่
  @Get('transient')
  getTransientValue() {
    return this.transientService.getValue();
  }
}
