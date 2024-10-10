import { Module } from '@nestjs/common';
import { TestingChapterController } from './testing-chapter.controller';
import { TestingChapterService } from './testing-chapter.service';
import { TestingChapterSecondService } from './testing-chapter.service-2nd';

@Module({
  controllers: [TestingChapterController],
  providers: [TestingChapterService, TestingChapterSecondService],
  exports: [TestingChapterService, TestingChapterSecondService],
})
export class TestingChapterModule {}
