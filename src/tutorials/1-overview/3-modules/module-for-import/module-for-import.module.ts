import { Module } from '@nestjs/common';
import { ModuleForImportController } from './module-for-import.controller';
import { ModuleForImportService } from './module-for-import.service';

@Module({
  controllers: [ModuleForImportController],
  providers: [ModuleForImportService],
  exports: [ModuleForImportService],
})
export class ModuleForImportModule {}
