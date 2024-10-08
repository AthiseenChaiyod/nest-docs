import { Module } from '@nestjs/common';
import { ChildModuleController } from './child-module.controller';
import { ChildModuleService } from './child-module.service';

@Module({
  controllers: [ChildModuleController],
  providers: [ChildModuleService],
  exports: [ChildModuleService],
})
export class ChildModuleModule {}
