import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

// บางครั้งเราก็อยากที่จะ extends BaseExceptionFilter มาใช้เฉย ๆ
@Catch()
// อันดับแรกก็ให้เรา extends BaseExceptionFilter มาก่อน
export class ExceptionFiltersChapterInheritFilter extends BaseExceptionFilter {
  // แล้วก็ให้เราประกาศ catch() เหมือนปกติ
  // แต่ว่าโค้ดของ catch() เราจะต้องเรียก super.catch() ของ parent
  // ประมาณว่าโค้ดนี้จะส่งโค้ดของตัวเองให้กับ parent ทำงานนั่นแหละ
  // แล้วเราก็ปรับแต่งเพิ่มเติมเอาต่อด้านล่างของ super.catch() ได้เลย
  catch(exception: HttpException, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
