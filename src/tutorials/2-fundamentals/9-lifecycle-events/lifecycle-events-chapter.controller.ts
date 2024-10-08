import { Controller, Get } from '@nestjs/common';
import { LifecycleEventsChapterService } from './lifecycle-events-chapter.service';

@Controller('lifecycle-events')
export class LifecycleEventsChapterController {
  constructor(private lifecycleService: LifecycleEventsChapterService) {}

  onModuleInit() {
    console.log(`This controller initialized at: ${new Date().toTimeString()}`);
  }

  @Get()
  getIndex() {
    return this.lifecycleService.getIndex();
  }
}
