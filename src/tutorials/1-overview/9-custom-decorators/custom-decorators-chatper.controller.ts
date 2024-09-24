import { Controller, Get, UsePipes } from '@nestjs/common';
import { ParamDecorator } from './custom-decorators-chapter.param';
import { IsStringPipe } from './custom-decorators-chapter.pipe';

@Controller('custom-decorators')
export class CustomDecoratorsChatperController {
  @Get()
  // ส่วนการนำมาใช้งานก็เรียกใช้แบบปกติเหมือนที่เราเรียก @Body(), @Param(), etc. ได้เลย
  // เรารับ data 1 ตัว เพราะงั้นเราสามารถใส่ argument 1 ตัวมาใน () ได้
  // เราสามารถนำ Pipe มาแปะไว้ได้ด้วยเหมือนกับที่เราใช้ใน @Body, @Param, etc.
  getIndex(@ParamDecorator('gender', IsStringPipe) gender: string) {
    return gender;
  }
}
