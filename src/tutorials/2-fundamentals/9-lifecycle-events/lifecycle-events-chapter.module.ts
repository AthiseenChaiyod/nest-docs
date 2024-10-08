import { Module } from '@nestjs/common';
import { LifecycleEventsChapterController } from './lifecycle-events-chapter.controller';
import { LifecycleEventsChapterService } from './lifecycle-events-chapter.service';
import { ChildModuleModule } from './child-module/child-module.module';

@Module({
  controllers: [LifecycleEventsChapterController],
  providers: [LifecycleEventsChapterService],
  exports: [LifecycleEventsChapterService],
  imports: [ChildModuleModule],
})
export class LifecycleEventsChapterModule {
  onModuleInit() {
    console.log(`This module initialized at: ${new Date().toTimeString()}`);
  }
}
