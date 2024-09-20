import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { PipesChapterPipe } from './pipes-chapter.pipe';
import { PipesChapterZodValidation } from './pipes-chapter.schema-validation';
import { pipesChapterSchema } from './pipes-chapter.dto';

@Controller(`pipes`)
export class PipesChapterController {
  @Get(`:id`)
  // ในการเอา Pipe มาใช้ก็แค่ให้เราใส่ , เอาไว้หลัง string ใน Decorator ที่ใช้ extract ข้อมูล
  // จากนั้นก็ใส่ Pipe ตามหลังไป เช่น @Param('id', SomePipe)
  // แต่ว่าจะมีการ binding pipe 2 วิธีด้วยกัน
  // วิธีแรก อย่างที่กล่าวไป เราจะใช้ class โดยตรงไปเลย
  // กับอีกวิธี ส่ง instance Pipe ไป เหมาะกับการที่เราต้องปรับแต่งการทำงานของ Pipe (หรือส่งค่าเข้าไปให้)
  // เช่น new ParseSomethingPipe({ ... }), new SomeValidationPipe(ValueA)
  getIndex(@Param(`id`, PipesChapterPipe) id: string) {
    return id;
  }

  @Post()
  // สองวิธีที่ว่านี้จะเอาไว้จัดการกับการ Validation field เดียว
  // ถ้ามีมากกว่า 1 field ให้ไปใช้ @UsePipes() แปะไว้กับ Schema Pipe ดีกว่า
  // @UsePipes() จะทำให้เราประกาศ Pipe ใน Scope อื่น ๆ นอกจาก method scope ได้ เช่น Controller Scope
  // และยังใช้ในกรณีที่มี fields หลายตัวที่จะต้อง validate อีกด้วยตามที่กล่าวไป
  // อย่างการใช้ Zod Validation ก็เป็นหนึ่งในตัวอย่างการใช้งานที่ดี เพราะมีหลาย fields ที่จะต้องเช็ค type
  @UsePipes(new PipesChapterZodValidation(pipesChapterSchema))
  getProfile(@Body() data: any) {
    return data;
  }

  // การประกาศ Global Pipe ก็อย่างที่เคยทำไปใน Controllers Chapter
  // ใช้ .useGlobalPipe() กับ app ได้เลย โดยให้เราส่งค่า Pipe ผ่าน () ของ .useGlobalPipe()
  // ดูได้อีกทีที่ main.ts
  // แต่ว่าอีกกรณีสำคัญก็คือ แล้วถ้าเราไม่ได้ส่งค่ามาให้กับ Pipe เพื่อ transform ล่ะ?
  // ค่าเป็น null / undefined จะทำยังไง
  // กรณีแรกคือให้เราไปเขียน If / Else เพื่อดักจับเอาเอง
  // อีกกรณีคือให้เราใช้ @DefaultValuePipe(value) เพื่อตั้งค่า default ให้กับมัน
  // ต่อให้เราไม่ส่งค่ามา เราก็ยังมี default value ให้ใช้อยู่ดี
  // แค่อย่าลืมว่าเวลาเราจะส่ง Argument เข้าไปให้เราสร้าง Pipe instance ใหม่เสมอ
  @Post(`default`)
  createSome(@Body('name', new DefaultValuePipe('Athiseen')) name: string) {
    return `This returns: ${name}`;
  }
}
