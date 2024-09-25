import { Module } from '@nestjs/common';

@Module({
  providers: [nonServiceBased],

  // ในการ export provider เรามีตัวเลือก 2 แบบ
  // แบบแรกใช้ token ไปเลย เช่น exports: ['SOME_TOKEN']
  // แบบที่สองใช้ชื่อ Class / Const ปกติ เช่น exports: [SomeService]
  exports: ['SOME_TOKEN'],
})
export class NonServiceBasedModule {}
