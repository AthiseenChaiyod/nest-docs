import { Module, Scope } from '@nestjs/common';
import { InjectionScopesChapterController } from './injection-scopes-chapter.controller';
import { InjectionScopesChapterTransientService } from './services/injection-scops-chapter.transient-service';
import { InjectionScopesChapterDefaultService } from './services/injection-scopes-chapter.default-service';
import { InjectionScopesChapterRequestService } from './services/injection-scopes-chapter.request-service';

@Module({
  controllers: [InjectionScopesChapterController],

  // เราสามารถใช้ scope ใน custom provider ได้เหมือนกัน
  providers: [
    InjectionScopesChapterDefaultService,
    InjectionScopesChapterRequestService,
    {
      provide: InjectionScopesChapterTransientService,
      useClass: InjectionScopesChapterTransientService,
      scope: Scope.TRANSIENT,
    },
  ],

  exports: [
    InjectionScopesChapterDefaultService,
    InjectionScopesChapterRequestService,
    InjectionScopesChapterTransientService,
  ],
})
export class InjectionScopesChapterModule {}
