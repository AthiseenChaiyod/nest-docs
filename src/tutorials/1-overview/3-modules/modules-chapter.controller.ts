import { Controller, Get } from '@nestjs/common';
import { ModulesChapterService } from './modules-chapter.service';

@Controller(`modules`)
export class ModulesChapterController {
  constructor(private modulesChapterService: ModulesChapterService) {}

  @Get()
  getIndex() {
    return this.modulesChapterService.getIndex();
  }
}
