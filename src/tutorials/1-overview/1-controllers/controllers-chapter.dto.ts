import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// สร้าง Dto ง่าย ๆ ก็แค่ประกาศ export class แล้วแปะ suffix Dto เอาไว้ข้างหลังชื่อ class ด้วย
// สาเหตุที่จะต้องใช้ class แทนที่จะเป็น interface เพราะว่าเราจะใช้ class-validator บนนี้ด้วย
// และการเขียนแยกกันระหว่าง type corrector กับ body filter ก็ทำให้เรากลับมาแก้ไขได้ง่าย
export class ControllersChapterDto {
  // ถ้าเราอยากจะ filter whitelist อันดับแรกก็ให้เราใช้ class-validator Decorator แปะ property ไว้ด้วย
  // แล้วเราก็จะไปประกาศใช้งาน Pipe ที่ main.ts เพื่อให้ Decorator ที่เราเขียนไว้ทำงาน
  // และตั้งค่าให้กับ Pipe ของเราให้กรอง property ที่ไม่ใช้ออกด้วย
  // ดูต่อได้ที่ main.ts
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsNumber()
  height: number;

  @IsNumber()
  weight: number;
}
