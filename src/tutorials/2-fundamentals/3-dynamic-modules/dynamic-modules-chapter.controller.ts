import { Controller, Get } from '@nestjs/common';
import { DynamicModulesChapterService } from './dynamic-modules-chapter.service';

@Controller('dynamic-modules')
export class DynamicModulesChapterController {
  constructor(
    private dynamicModulesChapterService: DynamicModulesChapterService,
  ) {}

  @Get('first-name')
  getFirstName() {
    return this.dynamicModulesChapterService.getFirstName();
  }

  @Get('last-name')
  getLastName() {
    return this.dynamicModulesChapterService.getLastName();
  }

  @Get('age')
  getAge() {
    return this.dynamicModulesChapterService.getAge();
  }

  @Get('gender')
  getGender() {
    return this.dynamicModulesChapterService.getGender();
  }
}
