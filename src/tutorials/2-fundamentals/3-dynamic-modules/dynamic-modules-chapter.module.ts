import { Module } from '@nestjs/common';
import { DynamicModulesChapterDynamicModule } from './dynamic-modules-chapter.dynamic-module';

@Module({
  // ในการเรียกใช้งาน Dynamic Module อันดับแรกให้เรา imports มันมาก่อน
  // แล้วเราจึงจะใช้ชื่อของ static method ในการใส่ข้อมูลที่เรากำหนดเอาไว้ใน () ของ method ไปให้
  // เช่น imports: [SomeModule.register({ username: 'athiseen', password: '1234' })]
  // ซึ่งข้อมูลตรงนี้ อย่างที่เราเห็นว่าเราต้องนำไปประกาศ custom provider เอาไว้ตรง providers ของ Dynamic Module
  // ถ้าเราไม่นำข้อมูลนี้ไปประกาศเอาไว้ เราจะไม่สามารถเข้าถึงข้อมูลได้
  // ทั้งหมดทั้งมวลนี้ก็จะเหมือนกับการ imports Module ปกตินั่นแหละ เราแค่ใส่ข้อมูลให้มันไปเพิ่มเติม
  imports: [
    DynamicModulesChapterDynamicModule.register({
      first_name: 'Athiseen',
      last_name: 'Chaiyod',
      age: 25,
      gender: 'male',
    }),
  ],
})
export class DynamicModulesChapterModule {}
