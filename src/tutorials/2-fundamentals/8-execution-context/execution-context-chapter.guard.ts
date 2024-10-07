import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  HttpArgumentsHost,
  RpcArgumentsHost,
  WsArgumentsHost,
} from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';

// ในหัวข้อนี้จะพูดถึง ArgumentsHost / ExecutionContext ที่เราเคยใช้กันในหัวข้อก่อนหน้า
// แล้ว ArgumentsHost กับ ExecutionContext ต่างกันยังไง?
// ArgumentsHost เป็น Class ที่รวม methods ที่จะเอาไว้เพื่อจัดการกับ argument ที่ถูกส่งมาให้กับ handler
// เช่นที่เราเคยใช้ host.switchToHttp() เพื่อบอกให้ NestJS รู้ว่านี่คือ HTTP Context นะ
// ส่วน ExecutionContext ก็คือ class ที่ inherit ArgumentsHost มาอีกที
// ทำให้ ExecutionContext จะมี method ให้ใช้เยอะกว่า ใช้งานได้หลากหลายกว่า
// แต่ว่าแล้วเราจะใช้ ArgumentsHost ทำไมในเมื่อ ExecutionContext มันดีกว่า?
// คำตอบก็คือแต่เดิมเรามีแต่ ArgumentsHost ไม่ได้มี ExecutionContext
// แปลว่า ExecutionContext ถูกเพิ่มมาทีหลังโดยมี ArgumentsHost เป็น base
// ทำให้เราก็ต้องรู้ด้วยว่า ArgumentsHost ใช้อะไรได้บ้าง เพราะว่า ExecutionContext ก็ทำได้เหมือนกัน
// ดังนั้นเรามาเริ่มพูดถึงจาก ArgumentsHost กันก่อน
// ตัวอย่างจะใช้ ExecutionContext เนื่องจากสามารถแทน ArgumentsHost ได้เหมือนกัน
@Injectable()
export class ExecutionContextChapterGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // โดยส่วนมาก ArgumentsHost จะนิยมใช้ 'host' เป็นชื่อ เพื่อหลีกเลี่ยงการสับสน
    // นอกจาก .switchToHttp() แล้ว ArgumentsHost ก็ยังมี method อีกมากมายให้ใช้
    // เช่น .getType() ที่จะส่งค่า string 'http', 'rpc', 'graphql' กลับมาให้
    // ทำให้เราสามารถนำ host.getType() ไปสร้างเป็น condition ต่าง ๆ ได้
    // แต่ถ้าเราจะใช้กับ GraphQL ให้เราใส่ generics <GqlContextType> เอาไว้ก่อน () ของ .getType() ด้วย
    // generics <GqlContextType> เราจะเอาไว้พูดอีกทีในอนาคตเมื่อเราอ่านถึงเรื่อง GraphQL แล้ว (ไกล)
    const argumentContextType: string = context.getType();

    // เราสามารถดึงข้อมูล Argument ออกมาได้ด้วยการทำ destructuring
    // โดยใช้ .getArgs() ที่จะทำให้เราต้อง destructuring array เพื่อนำค่ามาใช้
    // ถ้าเป็น Express เราจะมี 3 arguments ให้ใช้ คือ [req, res, next]
    // แต่ถ้าเกิดเป็น GraphQL จะมีอีกตัวเพิ่มมาคือ info ในตำแหน่งถัดจาก next
    const [req, res, next] = context.getArgs();

    // หรือถ้าเราไม่อยาก destructuring เราใช้ .getArgByIndex(number) แทนก็ได้
    // จะรับค่าตำแหน่งของตัวแปรที่เราอยากเข้าถึง
    // เช่น เราอยากเข้าถึง next function ที่อยู่ตำแหน่ง 2 ของ array
    // เราก็จะเขียน context.getArgByIndex(2) เพื่อดึงค่าออกมาใช้
    const req2 = context.getArgByIndex(0);
    const res2 = context.getArgByIndex(1);
    const next2 = context.getArgByIndex(2);

    // หรือถ้าเราจะเขียน Application ที่ทำงานหลาย platform เราก็สามารถทำได้
    // โดยเราจะเขียน function ให้ return type ประเภทต่าง ๆ ตาม platform นั้นกลับมา
    // ซึ่ง Type ที่เราจะใช้ก็คือ ...ArgumentsHost โดย ... จะเป็นได้ทั้ง Http, Rpc, Ws
    // ทำให้เราสามารถส่งค่า argument ประเภทนั้น ๆ กลับมาได้
    // เช่น function switchModeToRpc(): RpcArgumentsHost { ... }
    let sampleObject: HttpArgumentsHost | RpcArgumentsHost | WsArgumentsHost;

    // ต่อมาเราก็จะพูดถึงเรื่อง ExecutionContext
    // อย่างที่เรารู้กันอยู่แล้วว่า ExecutionContext สามารถใช้ .getClass / .getHandler ได้
    // อย่าลืมใส่ .name เอาไว้ให้ .getClass / .getHandler ด้วย ไม่อย่างนั้นจะไม่ได้ string
    // เราเคยเห็นไปแล้วในบท Guards เราจะนำ reflector มาใช้คู่กับ .getHandler ของ Execution Context
    // เราสามารถเข้าถึง Metadata ได้ด้วย .get() ของ reflector ที่จะรับค่า argument 2 ตัว
    // ตัวแรกคือ Metadata ที่เราจะเข้าถึง เช่น @Roles() ก็คือ Roles
    // ตัวที่สองคือ context.getHandler() เป็นชื่อ Method ที่เราจะ extract ข้อมูลออกมา
    // แต่ว่าเราอาจจะไม่ต้องสร้าง Custom Decorator เอาเองก็ได้ เพราะเรามี @SetMetadata() ให้ใช้
    // @SetMetadata() จะรับ 2 argument คือ string ชื่อของ Metadata และ value ของมัน
    // เช่น @SetMetadata('Role', 'admin')
    // ดูได้ที่ execution-context-chapter.controller.ts
    // ความแตกต่างก็มีแค่นี้แหละ เหมือนกับ ArgumentsHost ที่ใช้ .getClass / .getHandler ได้เฉย ๆ
    const className: string = context.getClass().name;
    const handlerName: string = context.getHandler().name;

    // ตัวอย่างการดึงข้อมูลจาก Metadata ที่ใช้ @SetMetadata()
    console.log(this.reflector.get('Role', context.getHandler()));

    return true;
  }
}
