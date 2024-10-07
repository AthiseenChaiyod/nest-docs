import { Module } from '@nestjs/common';
import { LazyLoadingModulesChapterController } from './lazy-loading-modules-chapter.controller';
import { LazyLoadingModulesChapterService } from './lazy-loading-modules-chapter.service';

@Module({
  controllers: [LazyLoadingModulesChapterController],
  providers: [LazyLoadingModulesChapterService],
  exports: [LazyLoadingModulesChapterService],
})
export class LazyLoadingModulesChapterModule {}
