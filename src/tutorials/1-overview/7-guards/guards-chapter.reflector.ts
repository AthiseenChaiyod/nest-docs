import { Reflector } from '@nestjs/core';

// ก่อนที่เราจะนำ Decorator ไปใช้งาน เราก็ต้องสร้างมันขึ้นมาก่อน
// โดยการประกาศ export const เป็นชื่อของ Decorator
// และใช้ Reflector.createDecorator<T>(); เพื่อสร้าง Decorator
// ถ้าเราอยากให้ Decorator ของเรารับ Type อะไรก็ให้ใส่เอาไว้ใน <T>
// แค่นี้เราก็สามารถนำ Decorator ของเราไปใช้ที่อื่นได้แล้ว
export const Roles = Reflector.createDecorator<string[]>();
