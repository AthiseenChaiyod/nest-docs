import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ExceptionFiltersChapterException } from './exception-filters-chapter.exception';
import { ExceptionFiltersChapterFilter } from './exception-filters-chapter.filter';

@Controller(`exception-filters`)
export class ExceptionFiltersChapterController {
  @Get()
  getIndex() {
    // บางครั้งเมื่อเราอยากให้เกิด error เราก็อยากที่จะควบคุมว่าให้แสดงอะไรให้ client เห็น
    // เพราะส่วนมากแล้ว default error log มันก็แค่แสดงให้เห็นว่า error เฉย ๆ ไม่ได้ช่วยอะไรเราเลย
    // เราเลยต้องมาเขียนแสดงเองว่าจะให้ขึ้นข้อความอะไรใน error log
    // ใช้ throw new HttpException(text: string, status: HttpStatus) ได้เลย
    // argument ตัวแรกจะเป็น string อะไรก็ได้ เป็นข้อความแสดงว่า error เกิดจากอะไร
    // ส่วน argument อีกตัวจะรับค่าตัวเลขใด ๆ แต่ว่าใช้ HttpStatus Enumerator จะอ่านง่ายกว่า
    // HttpException() เป็น built-in พื้นฐาน มีอีกมากมายให้ใช้ เช่น BadRequestException(), etc.
    // ถ้าเราอยากสร้าง Exception เอง ให้ดูได้ที่ exception-filters-chapter.exception.ts
    throw new HttpException('Bad Request!', HttpStatus.BAD_REQUEST);
  }

  @Post()
  // การนำ Exception Filter ไปใช้ก็ให้แปะ @UseFilters() เอาไว้กับ method หรือจะแปะตรง @Controller() ก็ได้
  // แล้วให้เราใส่ class เข้าไปใน @UseFilters()
  // สามารถคั่นได้ด้วย , เพื่อประกาศหลายตัวเหมือนเดิม
  // ที่น่าสนใจคือการประกาศ Global Exception Filter
  // สามารถดูได้ที่ main.ts
  @UseFilters(ExceptionFiltersChapterFilter)
  create() {
    throw new ExceptionFiltersChapterException();
  }
}
