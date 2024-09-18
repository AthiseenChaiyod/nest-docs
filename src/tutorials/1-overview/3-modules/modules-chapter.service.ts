import { Injectable } from '@nestjs/common';

@Injectable()
export class ModulesChapterService {
  getIndex() {
    return `This is index page.`;
  }
}
