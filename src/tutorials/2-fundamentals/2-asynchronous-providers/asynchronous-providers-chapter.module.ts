import { Module } from '@nestjs/common';
import { AsynchronousProvidersChapterService } from './asynchronous-providers-chapter.service';
import { AsynchronousProvidersChapterController } from './asynchronous-providers-chapter.controller';

@Module({
  controllers: [AsynchronousProvidersChapterController],

  // การประกาศ providers: [...] เราก็ใส่ const เข้ามาได้เลยเหมือนในตัวอย่างที่ custom providers
  providers: [AsynchronousProvidersChapterService],
})
export class AsynchronousProvidersChapterModule {}
