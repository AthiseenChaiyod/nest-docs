import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestingChapterGlobalGuard } from './tutorials/2-fundamentals/10-testing/guard/testing-chapter.guard';
import { APP_GUARD } from '@nestjs/core';
import { TestingChapterGlobalGuardService } from './tutorials/2-fundamentals/10-testing/guard/testing-chapter.service';

@Module({
  controllers: [AppController],
  providers: [
    AppService,

    // เพิ่ม Global Guard ไปตัวนึงเพราะว่าจะทดสอบการทำงานของ .override...()
    // อ่านได้ที่ folder: ./2-fundamentals/10-testing
    {
      provide: APP_GUARD,
      useFactory: (service: TestingChapterGlobalGuardService) => {
        return new TestingChapterGlobalGuard(service);
      },
      inject: [TestingChapterGlobalGuardService],
    },
    TestingChapterGlobalGuardService,
  ],
})
export class AppModule {}
