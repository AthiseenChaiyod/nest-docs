import { Injectable } from '@nestjs/common';

@Injectable()
export class ModuleForImportService {
  getValue() {
    return 3;
  }
}
