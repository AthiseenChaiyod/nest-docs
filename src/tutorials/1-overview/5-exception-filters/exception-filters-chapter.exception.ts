import { HttpException, HttpStatus } from '@nestjs/common';

// ในการสร้าง Exception เองเราจะต้อง extends เอาจาก HttpException
export class ExceptionFiltersChapterException extends HttpException {
  constructor() {
    // เมื่อเรา extends class ใด ๆ และมี constructor อยู่ใน child เราต้องสร้าง super ใน child ด้วย
    // แปลง่าย ๆ ก็คือเรา extends HttpException มาเพื่อตั้งชื่อ class เองนั่นแหละ
    // กรณีใช้ Exception ที่ต้องประกาศ new HttpException() บ่อย ๆ ให้มาสร้างเอาเองดีกว่า
    // แต่ถ้าเกิดไม่ได้สร้าง HttpException บ่อย (ใช้ built-in) ก็ไม่ต้องสร้างก็ได้
    // การนำไปใช้ก็แค่ import ไปใช้เหมือนที่เราใช้ HttpException() เลย
    super('WARNING: ERROR OCCURED!', HttpStatus.FORBIDDEN);
  }
}
