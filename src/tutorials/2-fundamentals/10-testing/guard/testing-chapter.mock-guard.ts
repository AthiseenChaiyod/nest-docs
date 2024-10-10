import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MockGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log(`This is mock-up guard!`);
    return true;
  }
}
