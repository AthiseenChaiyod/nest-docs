import { ModuleForImportService } from './module-for-import.service';
import { Controller, Get } from '@nestjs/common';

@Controller(`imported-module`)
export class ModuleForImportController {
  constructor(private moduleForImportService: ModuleForImportService) {}

  @Get()
  getValue() {
    return this.moduleForImportService.getValue();
  }
}
