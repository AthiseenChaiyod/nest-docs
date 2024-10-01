import { Inject, Injectable } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from './configurable-module.dynamic-module';
import { ConfigurableModuleInterface } from './configurable-module.interface';

@Injectable()
export class ConfigurableModuleService {
  constructor(
    // ใช้ MODULE_OPTIONS_TOKEN ที่เรา destructuring แทนการสร้าง custom provider เอง
    @Inject(MODULE_OPTIONS_TOKEN) private options: ConfigurableModuleInterface,
  ) {}

  getUsername() {
    return this.options.username;
  }

  getPassword() {
    return this.options.password;
  }

  getEmail() {
    return this.options.email;
  }
}
