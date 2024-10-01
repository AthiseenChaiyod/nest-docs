import { ConfigurableModuleService } from './configurable-module.service';
import { Controller, Get } from '@nestjs/common';

@Controller('configurable-module')
export class ConfigurableModuleController {
  constructor(private configurableModuleService: ConfigurableModuleService) {}

  @Get('username')
  getUsername() {
    return this.configurableModuleService.getUsername();
  }

  @Get('password')
  getPassword() {
    return this.configurableModuleService.getPassword();
  }

  @Get('email')
  getEmail() {
    return this.configurableModuleService.getEmail();
  }
}
