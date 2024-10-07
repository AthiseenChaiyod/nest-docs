import { Injectable } from '@nestjs/common';

@Injectable()
export class LazyLoadingModulesProviderService {
  getIndex() {
    return `this is Lazy-loading provider!`;
  }
}
