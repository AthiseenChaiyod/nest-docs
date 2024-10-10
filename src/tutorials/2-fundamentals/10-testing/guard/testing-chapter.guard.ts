import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TestingChapterGlobalGuardService } from './testing-chapter.service';

@Injectable()
export class TestingChapterGlobalGuard implements CanActivate {
  constructor(private guardService: TestingChapterGlobalGuardService) {}

  canActivate(context: ExecutionContext): boolean {
    console.log(this.guardService.getIndex());
    return true;
  }
}
