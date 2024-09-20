import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionFiltersChapterController } from './tutorials/1-overview/5-exception-filters/exception-filters-chapter.controller';

@Module({
  controllers: [AppController, ExceptionFiltersChapterController],
  providers: [AppService],
})
export class AppModule {}
