import { Injectable } from '@nestjs/common';

@Injectable()
export class TestingChapterSecondService {
  getValue() {
    return `This is only for test!`;
  }
}
