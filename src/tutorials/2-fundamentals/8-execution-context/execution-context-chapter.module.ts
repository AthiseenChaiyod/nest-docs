import { Module } from '@nestjs/common';
import { ExecutionContextChapterController } from './execution-context-chapter.controller';
import { ExecutionContextChapterService } from './execution-context.chapter.service';

@Module({
  controllers: [ExecutionContextChapterController],
  providers: [ExecutionContextChapterService],
  exports: [ExecutionContextChapterService],
})
export class ExecutionContextChapterModule {}
