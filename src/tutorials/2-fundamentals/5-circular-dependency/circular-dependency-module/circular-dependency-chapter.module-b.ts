import { Module } from '@nestjs/common';
import { CircularDependencyChapterModuleA } from './circular-dependency-chapter.module-a';

@Module({
  imports: [CircularDependencyChapterModuleA],
})
export class CircularDependencyChapterModuleB {}
