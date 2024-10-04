import { Module } from '@nestjs/common';
import { ModuleReferenceChapterController } from './module-reference-chapter.controller';
import { ModuleReferenceChapterService } from './module-reference-chapter.service';
import { ModuleReferenceChapterServiceB } from './module-reference-chapter.service-b';

@Module({
  controllers: [ModuleReferenceChapterController],
  providers: [ModuleReferenceChapterService, ModuleReferenceChapterServiceB],
  exports: [ModuleReferenceChapterService, ModuleReferenceChapterServiceB],
})
export class ModuleReferenceChapterModule {}
