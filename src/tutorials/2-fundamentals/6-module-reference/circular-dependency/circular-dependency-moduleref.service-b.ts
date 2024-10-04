import { Injectable } from '@nestjs/common';
import { CircularDependencyModuleRefServiceA } from './circular-dependency-moduleref.service-a';

@Injectable()
export class CircularDependencyModuleRefServiceB {
  constructor(private circularA: CircularDependencyModuleRefServiceA) {}
}
