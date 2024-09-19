import { Controller, Get } from '@nestjs/common';

@Controller()
export class MiddlewareChapterController {
  @Get()
  findAll() {
    return `This is find all method!`;
  }
}
