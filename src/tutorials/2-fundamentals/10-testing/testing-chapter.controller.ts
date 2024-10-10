import { TestingChapterSecondService } from './testing-chapter.service-2nd';
import { Controller, Get } from '@nestjs/common';
import { TestingChapterService } from './testing-chapter.service';

@Controller('testing')
export class TestingChapterController {
  constructor(
    private testingService: TestingChapterService,
    private testingSecondService: TestingChapterSecondService,
  ) {}

  @Get()
  getIndex() {
    return this.testingService.getIndex();
  }

  @Get('all')
  getAll() {
    return this.testingSecondService.getValue();
  }
}
