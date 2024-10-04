import { Controller, Get } from '@nestjs/common';
import { ModuleReferenceChapterService } from './module-reference-chapter.service';

@Controller('module-reference')
export class ModuleReferenceChapterController {
  constructor(private moduleRefService: ModuleReferenceChapterService) {}

  @Get()
  getIndex() {
    return this.moduleRefService.getIndex();
  }

  @Get('info')
  getInfo() {
    return this.moduleRefService.getInfo();
  }

  @Get('value')
  getValue() {
    return this.moduleRefService.getValue();
  }
}
