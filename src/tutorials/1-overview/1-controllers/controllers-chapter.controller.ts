import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Redirect,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { ControllersChapterDto } from './controllers-chapter.dto';

// อันดับแรก Controller เอาไว้จัดการกับ Request ที่เข้ามา ว่าพอเข้ามาแล้วจะให้ไปทำอะไรที่ไหนต่อ
// เวลาที่เราจะสร้าง Controller จะแปะ @Controller() Decorator เอาไว้บน export class
// ข้างใน () เราสามารถใส่ string เข้าไปได้ เช่น @Controller('Europe')
// string ข้างในจะทำหน้าที่เป็น URL path ต่อจาก Domain ของเรา
// เวลาที่จะเข้าใช้งาน Controller นี้จะต้องมี URL path ต่อมาด้วยเสมอ
// เช่น localhost:3000/Europe
// ถ้าเราไม่ใส่ก็แปลว่าไม่ได้ตั้งค่า URL path ให้ จะเรียกใช้ด้วย localhost:3000 ได้เลย
// พยายามอย่าลืมใส่ string เอาไว้ ให้แค่ตัว AppController เป็น Controller ว่างตัวเดียวก็พอ
// ไม่งั้น path จะซ้ำกันได้
@Controller(`controllers`)
// ชื่อของ Controller เราแนะนำจะแปะ Controller string suffix เอาไว้ข้างหลัง
export class ControllersChapterController {
  // ในการจัดการกับ CRUD พื้นฐาน เราจะมี built-in decorator เอาไว้ให้ใช้
  // จะประเภทของ Request เช่น @Get(), @Post(), @Patch(), etc.
  // หมายความว่าถ้าส่ง GET Request มา Controller ก็จะดูเฉพาะแค่โค้ดที่แปะ @Get() เอาไว้เท่านั้น
  // ในการสร้าง CRUD Routing นั้นก็ให้เราแปะ HTTP Decorator เหล่านี้ไว้บน function ได้เลย
  @Get()
  findAll() {
    return `This is find all function.`;
  }

  // เราสามารถใส่ string path เอาไว้ใน () ได้เหมือน Controller เลย
  // จะทำให้เราต้องใส่ URL Path ที่ระบุเอาไว้ใน () เพื่อเข้าใช้งาน function นี้ด้วย
  @Get(`find-all`)
  anotherFindAll() {
    return `This is also find all function, but it is on another route.`;
  }

  // เราสามารถรับค่าผ่าน function ได้เหมือน function ปกติ
  // แต่ถ้าเป็น data เกี่ยวกับ Request ที่ส่งมาเราจะต้องใช้ Decorator เพื่อ extract data ออกมา
  // เช่น @Body(), @Param(), @Header(), @Req(), etc.
  // ให้เราประกาศ Decorator เอาไว้ใน function และหลัง () ให้กำหนดชื่อ ใส่ Type ให้เรียบร้อย
  // เช่น doSomething(@Param() name: any) {...}
  // ต้องระวังไว้ว่าถ้าเกิดเราไม่ได้ extract ตัวใดตัวหนึ่ง เราจะได้ object กลับมาเสมอ
  // สมมติว่า @Get(`:id/:name`) แล้วเราระบุแค่ @Param() data: any เราปล่อยให้ () ของ @Param ว่างเอาไว้
  // data ของเราจะมีค่า { id: value, name: value }
  // แต่ถ้าเราระบุเอาไว้ใน () ของ @Param() เช่น @Param(`id`) id: string
  // แปลว่าเราจะ extract ค่านั้นออกมาจาก object แล้วเรียบร้อย โดยเอามาเก็บไว้ในตัวแปรชื่อ id เป็น string
  // ถ้าเราต้อง extract หลายตัว จะต้องคั่นด้วย , แล้วก็ประกาศ @Param() ต่อแบบเดิม

  // ใด ๆ ก็ตาม การใส่ : หน้าตัวแปร path หมายถึงตัวแปรตัวนั้นจะเป็น dynamic parameter ที่เราต้องส่งมากับ path ด้วย
  // เช่น @Get(`:id`) แปลว่าให้เราใส่อะไรไปก็ได้แทนที่ path ตรงนี้ มันจะเอาค่าไปเก็บไว้ใน id แทน
  // เช่น localhost:3000/athiseen เราก็จะได้ route parameter id ที่มี value คือ `athiseen`
  @Post(`:id`)
  @Header('Cache-Control', 'none')
  create(@Param(`id`) id: string) {
    return `Route parameter: ${id}`;
  }

  // เราสามารถใช้ * เพื่อแทน `อะไรก็ได้` ใน string path ได้
  // เช่น @Get(`some*thing`) หมายความว่า path ที่ขึ้นต้นด้วย some และลงท้ายด้วย thing จะนับทั้งหมด
  // localhost:3000/some1thing, localhost:3000/someathiseen12thing, etc.
  // ยกเว้นแต่ special character ที่เกี่ยวข้องกับ path เช่น / ที่ห้ามใส่เข้าไป (เกิดบั๊ก)
  @Put(`up*date`)
  update() {
    return `This is wildcard update function`;
  }

  // โดยทั่วไปแล้วเวลาที่เราส่ง Request สำเร็จ เราจะได้ Status Code 200 กลับมา
  // ยกเว้น POST ที่เราจะได้ 201 กลับมา
  // ถ้าเราอยาก Override ส่วนนี้ให้เราใช้ @HttpCode() แปะหัวเอาไว้ข้างล่างพวก HTTP Methods Decorator
  // โดยข้างใน () ของเราให้ใส่ตัวเลข status code ที่เราต้องการเอาไว้ในนั้น
  // แนะนำให้ใช้ HttpStatus แทนตัวเลขโดยตรง เพราะการ maintain จะทำได้ดีกว่า
  // ให้เราใส่ . หลัง HttpStatus แล้วเลือก Status เอาได้เลย
  @Patch()
  @HttpCode(HttpStatus.FORBIDDEN)
  partialUpdate() {
    return `This is partial update function with customized status code.`;
  }

  // หรือเราอยากจะตั้งค่าให้มีการ Redirect ไปอีกหน้าหลังเรียกใช้ก็ได้เหมือนกัน
  // ใช้ @Redirect(path: string, status_code: number) แปะเอาไว้เหมือนกับ @HttpCode() เลย
  @Delete()
  @Redirect('https://youtube.com', HttpStatus.FOUND)
  delete() {
    return `This should redirects you to Youtube.`;
  }

  // เราสามารถใช้ @Header(header: string, value: string) เพื่อตั้งค่า Response ของเราก่อนส่งกลับไปได้
  // เช่น @Header('Content-Type', 'application/json') เพื่อบอกว่า Response นี้เป็น JSON นะ
  @Post(`custom-header`)
  @Header('Cache-Control', 'none')
  returnJson() {
    return `This will not be cache on client's PC.`;
  }

  // ใด ๆ ก็ตาม เราสามารถเขียน function ของเราให้เป็น Asynchronous ได้
  // แค่ปรับ Type ให้ตรงกันก็พอ
  @Get(`async`)
  async someAsyncFunction(): Promise<string> {
    return `This is encapsulated in Asynchronous Function!`;
  }

  // เขียนเป็น Observable ก็ได้เหมือนกัน
  @Get(`observable`)
  someObservableFunction(): Observable<string> {
    return of('This is encapsulated in Observable!');
  }

  // โดยปกติแล้วถ้าเราไม่ได้กำหนดอะไร client จะสามารถส่งอะไรมาให้เราก็ได้ใน body
  // ถ้าเราอยาก filter เอาเฉพาะที่อยากได้ หรือบังคับให้ client ใส่มาให้ถูกต้องก็จะต้องใช้ Dto
  // กดไปอ่านการสร้าง Dto ได้ที่ไฟล์ controllers-chapter.dto.ts ได้เลย
  // พอเรามี Dto แล้วก็ให้เรามากำหนด type ให้กับตัวแปร @Body() ของเราเป็น Dto ของเราแทน
  // ก็เหมือนกับการทำ type correction ปกติ
  @Post(`post/dto`)
  createGreatWork(@Body() data: ControllersChapterDto) {
    return data;
  }
}
