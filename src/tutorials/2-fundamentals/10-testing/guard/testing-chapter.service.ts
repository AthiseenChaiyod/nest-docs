import { Injectable } from '@nestjs/common';

@Injectable()
export class TestingChapterGlobalGuardService {
  getIndex() {
    return `This is a service for global guard!`;
  }
}
