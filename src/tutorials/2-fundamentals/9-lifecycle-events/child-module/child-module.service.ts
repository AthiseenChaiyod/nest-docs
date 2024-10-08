import { Injectable } from '@nestjs/common';

@Injectable()
export class ChildModuleService {
  onModuleInit() {
    console.log(`Child module init!`);
  }
}
