import { Module } from '@nestjs/common';
import { InjectionScopesChapterModule } from '../injection-scopes-chapter.module';
import { InjectionScopesChapterSecondController } from './injection-scopes-chapter.second-controller';

@Module({
  controllers: [InjectionScopesChapterSecondController],
  imports: [InjectionScopesChapterModule],
  exports: [InjectionScopesChapterModule],
})
export class InjectionScopesChapterSecondModule {}
