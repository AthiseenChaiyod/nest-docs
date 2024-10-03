import { forwardRef, Module } from '@nestjs/common';
import { CircularDependencyChapterModuleB } from './circular-dependency-chapter.module-b';

// ในการแก้ไขปัญหา circular dependency ของ module ก็สามารถใช้ forwardRef() ได้เหมือนกัน
// เพียงแต่เราจะไม่สามารถ Inject เข้ามาได้ ทำให้เราต้องไปประกาศเอาไว้ใน imports แทน
// เช่น imports: [forwardRef(() => SomeModule)]
@Module({
  imports: [forwardRef(() => CircularDependencyChapterModuleB)],
})
export class CircularDependencyChapterModuleA {}
