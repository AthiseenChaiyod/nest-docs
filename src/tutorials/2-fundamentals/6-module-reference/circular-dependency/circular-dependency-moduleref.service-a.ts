import { Injectable } from '@nestjs/common';
import { CircularDependencyModuleRefServiceB } from './circular-dependency-moduleref.service-b';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class CircularDependencyModuleRefServiceA {
  // ในการแก้ไขปัญหา Circular Dependency ด้วย ModuleRef ที่กล่าวไปในบทก่อนหน้า
  // เราจะไม่ inject service ที่เราจะใช้ใน constructor แต่ว่าเราจะ inject ModuleRef เข้าไปแทน
  // แล้วเราจะใช้ lifecycle hook ที่ชื่อว่า onModuleInit() { ... } ในการดึงค่า service มาให้แทน
  // โดยอันดับแรกก็ให้เราสร้างตัวแปรรอเอาไว้ก่อน
  serviceB: CircularDependencyModuleRefServiceB;

  // จากนั้นก็จะ inject ModuleRef เพื่อรอดึงค่า instance ของ service มา
  constructor(private moduleRef: ModuleRef) {}

  // แล้วเราก็จะใช้ onModuleInit() ที่จะทำงานอัตโนมัติตอนสร้าง instance
  // โดยเราจะให้ตัวแปรที่เราเตรียมไว้มีค่าเท่ากับ instance ของ service ที่เรากำหนด
  // แต่ว่าเราจะต้องใส่ strict: false เอาไว้ด้วยถ้าเกิดเราไม่ได้ register มันเอาไว้ใน Module
  // ในปลายทางแล้ว วิธีนี้ก็จะได้ instance ของ service เหมือนกับการ inject ปกติอยู่ดี
  // เราจะได้เจอ lifecycle อีกทีในบทถัด ๆ ไป
  onModuleInit() {
    this.serviceB = this.moduleRef.get(CircularDependencyModuleRefServiceB, {
      strict: false,
    });
  }
}
