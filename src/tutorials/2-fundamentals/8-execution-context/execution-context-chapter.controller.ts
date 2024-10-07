import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { ExecutionContextChapterService } from './execution-context.chapter.service';
import { ExecutionContextChapterGuard } from './execution-context-chapter.guard';

@Controller('execution-context')
export class ExecutionContextChapterController {
  constructor(
    private executionContextService: ExecutionContextChapterService,
  ) {}

  @Get()
  @SetMetadata('Role', 'admin')
  @UseGuards(ExecutionContextChapterGuard)
  getIndex() {
    return this.executionContextService.getIndex();
  }
}
