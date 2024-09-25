import { Controller, Get } from '@nestjs/common';
import { CustomProvidersChapterService } from './custom-providers-chapter.service';

@Controller()
export class CustomProvidersChapterController {
  constructor(
    private customProvidersChapterService: CustomProvidersChapterService,
  ) {}

  @Get()
  getIndex() {
    this.customProvidersChapterService.getIndex();
  }
}
