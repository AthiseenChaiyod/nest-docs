import { Controller, Get, Inject } from '@nestjs/common';

@Controller('asynchronous-providers')
export class AsynchronousProvidersChapterController {
  constructor(
    @Inject('ASYNC_PROVIDER')
    private asyncProvider: number,
  ) {}

  @Get()
  getIndex() {
    return this.asyncProvider;
  }
}
