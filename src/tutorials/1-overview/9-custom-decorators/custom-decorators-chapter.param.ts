import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

// นอกจากพวก @Param, @Body, etc. แล้ว เราสามารถสร้าง Decorator เพื่อ extract ข้อมูลเองได้
// จะมี Argument Metadata type เป็น 'custom' ไม่ใช่ทั้ง 'body', 'param', 'query'
// โดยเราจะสร้างตัวแปรขึ้นมาหนึ่งตัวและกำหนดค่าของ Param Decorator ด้วย createParamDecorator()
// โดยข้างในของ createParamDecorator() จะรับ arrow function 1 ตัว
// โดยส่วนมากแล้วตัวแรกเราจะใส่ data ไป เพราะว่าเวลาที่เราเรียกใช้ Decorator นี้ก็อาจจะมีการส่งค่ามาใน ()
// เช่น @SomeDecorator('firstName') แบบนี้ data เราก็คือ 'firstName'
// ส่วนอีกตัวเราจะใช้ ExecutionContext เพื่อที่เราจะสามารถเข้าถึงการทำงานระดับ Framework ได้
// เช่น อยากรู้ว่า Request นี้มี body ชื่อนี้ไหม แล้วถูกส่งไปทำงานที่ getIndex() ของ Controller หรือเปล่า
// เช่น if(ctx.switchToHttp().getRequest().body.username && ctx.getHandler().name === 'getIndex')
// หากเราต้องสร้าง ParamDecorator ให้พยายามจัดหมวดหมู่เป็นที่เดียวกันไว้ จะได้ไม่หายาก แก้ไขยาก
export const ParamDecorator = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    // เวลา extract ให้ระวังไว้ 2 อย่าง
    // อย่างแรก อย่าลืมว่าเราต้อง .body, .header, .etc. ด้านหลัง .getRequest() ด้วย ไม่งั้นจะหาไม่เจอ
    // อย่างที่สองก่อนที่เราจะนำ data ไปใช้ . ได้ต้องใส่ ? เอาไว้หน้า . ด้วย
    // เพื่อบอกว่าโค้ดตรง ? มีค่าไหม ถ้าไม่มีไม่ต้อง .[data] มานะ เพราะยังไงก็ได้ null / undefined
    // ควรเขียนเช็ค type เพื่อกัน undefined / null ด้วย
    const extractedValue = ctx.switchToHttp().getRequest().body?.[data];

    if (extractedValue) {
      return extractedValue;
    } else {
      throw new BadRequestException();
    }
  },
);
