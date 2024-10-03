import { Injectable } from '@nestjs/common';
import { CircularDependencyChapterServiceA } from './circular-dependency-chapter.service-a';

@Injectable()
export class CircularDependencyChapterServiceB {
  constructor(private serviceA: CircularDependencyChapterServiceA) {}
}
