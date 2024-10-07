import { Injectable } from '@nestjs/common';

@Injectable()
export class ExecutionContextChapterService {
  getIndex() {
    return `This is Execution Context Chapter!`;
  }
}
