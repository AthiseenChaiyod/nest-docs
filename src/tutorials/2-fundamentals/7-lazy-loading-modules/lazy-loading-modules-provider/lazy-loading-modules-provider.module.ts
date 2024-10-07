import { Module } from '@nestjs/common';
import { LazyLoadingModulesProviderService } from './lazy-loading-modules-provider.service';

@Module({
  providers: [LazyLoadingModulesProviderService],
  exports: [LazyLoadingModulesProviderService],
})
export class LazyLoadingModulesProviderModule {}
