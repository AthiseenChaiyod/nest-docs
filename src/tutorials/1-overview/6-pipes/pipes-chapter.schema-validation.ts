import {
  ArgumentMetadata,
  BadRequestException,
  ForbiddenException,
  Injectable,
  Optional,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

// ในการทำ schema validation นั้นเราได้เคยทำไปแล้วใน Controllers Chapter
// ที่ไฟล์ controllers-chapter.dto.ts
// จะเห็นว่าเราแปะ Decorator แล้วก็ใช้ useGlobalPipe() เพื่อทำการ filter property ที่ไม่ใช้ออก
// ใน Chapter นี้เราจะมาพูดถึงอีกวิธี นั่นก็คือ Zod Validation
// ในการใช้งานง่าย ๆ ที่จริง built-in ValidationPipe ก็เพียงพอแล้ว
// แต่ถ้าเราต้องการการทำงานที่ซับซ้อนเราก็ต้องมาสร้าง Validator เอง
// และการใช้ Zod จะทำให้เราเขียนโค้ดสั้นกว่ามากโดยการใช้ Method Chaining (และอ่านง่ายกว่า)
// อันดับแรกก็ให้เราสร้าง Dto ขึ้นมาหนึ่งตัวโดยใช้ Zod
// ให้เราลง Zod เอาไว้ด้วย โดยใช้คำสั่ง npm i --save zod
// จากนั้นก็ให้เราสร้าง Pipe ปกติได้เลย แต่ว่าให้เรา inject ZodSchema เข้าไปด้วย
@Injectable()
export class PipesChapterZodValidation implements PipeTransform {
  // อีกส่วนสำคัญของ Pipe คือเวลาเราใส่ injection เข้ามาจะหมายถึงว่าเรารับค่า optional argument อะไรบ้าง
  // ไม่ใช่ว่าเราประกาศ service เหมือนปกติอย่างที่เราทำใน @Controller(), etc.
  // สมมติให้ constructor(private someValue: any) {}
  // จะหมายถึงให้เราสร้าง instance ของ Pipe นี้และให้เราใส่ค่ามาให้ด้วยใน ()
  // เช่น @UsePipes(new SomePipe(SomeValue)) ถ้าใส่มา someValue: any ของเราก็จะกลายเป็น SomeValue ที่ส่งมา
  // เช่นเดียวกันกับการประกาศ zodSchema ด้านล่าง เราจะต้องส่งค่าที่มี type ZodSchema มาด้วยตอนสร้าง instance
  // แปลว่าการใส่ constructor () {} มาใน pipe จะทำให้เราต้องสร้าง instance ใหม่และส่งค่าไปให้มันด้วยเสมอ
  // หากเรามี optional argument หลายตัว ก็ให้ใส่มาตามลำดับที่ระบุเอาไว้ใน constructor
  // เช่น constructor(private valueA: any, private valueB: any) {}
  // เราก็จะต้องใส่ @UsePipes(new SomePipe(ValueA, ValueB)) ถ้าใส่ ValueB, ValueA ก็จะถูกเก็บสลับที่กัน
  // แล้วถ้าเกิดเรามี service ที่ inject มาใช้จริง ๆ เหมือนตอนเราใช้ใน @Controller() ล่ะ?
  // เราก็งานเข้าไง เพราะเราไม่สามารถทำสองอย่างพร้อมกันได้ เราจะต้องเลือกระหว่าง inject หรือ optional argument
  // แต่ถ้าเราต้องการทั้ง 2 อย่างจริง ๆ ให้เราส่ง class ไปแทน instance ตรง @UsePipes()
  // แล้วเราก็ต้องหาทางที่จะส่ง optional argument นั้นเข้ามาในนี้เอง เช่น สร้าง get/set เอง
  // วนกลับมาที่เดิมก่อนจะนอกเรื่องไปไกล สรุปแล้ว constructor จะบังคับให้เราสร้าง instance ใหม่และส่งค่าเข้ามาให้ด้วย
  constructor(@Optional() private zodSchema?: ZodSchema) {}

  transform(data: any, metadata: ArgumentMetadata) {
    // คำสั่ง parse ของ ZodSchema จะทำการตรวจเช็คว่า Type ตรงกับที่ระบุเอาไว้หรือเปล่า
    // จาก constructor ที่เราเขียน แปลว่าเราจะต้องส่งค่ามาหนึ่งตัวที่มี type ZodSchema
    // แล้วค่าที่เราส่งมาก็จะถูกนำมาเป็น blueprint เพื่อเอาไว้เช็ค type ของเรา
    // โดยเราจะใช้คำสั่ง parse ของ Zod ในการตรวจสอบ type
    // ข้อมูลที่เราส่งไปใน parse() ก็จะถูกนำไปเทียบกับ zodSchema ที่เราใส่ค่า type ให้มันไปแล้ว
    // แล้วก็ให้เราไปเขียน Exception ในการจัดการกับ error เอาเอง
    // ส่วนการจะส่ง argument ZodSchema มาได้เราก็ต้องมี object type ZodSchema ก่อน
    // ให้เราไปสร้าง Dto ขึ้นมาตัวนึง อ่านต่อได้ที่ไฟล์ pipes-chapter.dto.ts
    if (this.zodSchema) {
      try {
        const parsedData = this.zodSchema.parse(data);
        return parsedData;
      } catch (error) {
        throw new BadRequestException();
      }
    } else {
      throw new ForbiddenException();
    }
  }
}
