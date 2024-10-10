import { Injectable } from '@nestjs/common';

@Injectable()
export class TestingChapterService {
  getIndex() {
    return `This is Testing Chapter!`;
  }
}
