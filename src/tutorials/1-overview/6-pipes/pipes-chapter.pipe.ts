import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

// Pipe มีหน้าที่หลัก ๆ สองอย่าง
// อย่างแรกคือแปลงข้อมูลที่เข้ามาให้เป็นข้อมูลที่เราอยากได้
// อย่างที่สองคือตรวจสอบประเภทของข้อมูลว่าถูกต้องหรือไม่
// ให้นึกถึงเครื่องจักรในโรงงาน ถ้าเรานำมันฝรั่งใส่ไป ปลายทางเราจะได้ขนมมาหนึ่งห่อ
// ระหว่างทางอาจจะมีการแปลงจากมันฝรั่งสดเป็นปอกเปลือก หั่นบาง ๆ แล้วเอาไปทอด
// ผ่านขั้นตอนการปรุงรส จากนั้นก็เอาใส่ห่อ แล้วปลายทางเราก็ได้ถุงขนมมา
// ขั้นตอนการเปลี่ยนมันฝรั่งเป็นถุงขนมนี่แหละ คือ Pipe ของเรา
// เราอยากได้อะไรก็ให้เขียนแปลงให้เป็นแบบนั้น
// หรือเราอาจจะช่างน้ำหนักดูว่ามันฝรั่งลูกนี้หนักถึงเกณฑ์ไหม ถ้าไม่ก็ไม่เอา แจ้งข้อผิดพลาด
// นี่ก็คือตัวอย่างอีกอย่างหนึ่งของ Pipe ที่จะตรวจสอบข้อมูลแล้วส่งแจ้งเตือนกลับไป
// เริ่มต้นด้วยการสร้าง Injectable() แปะเอาไว้บน export class ก่อน
@Injectable()
// จากนั้นให้เรา implements PipeTransform ที่จะมีคำสั่งเกี่ยวกับ Pipe ให้เราใช้งาน
export class PipesChapterPipe implements PipeTransform {
  // การ implements PipeTransform จะทำให้เราต้องใส่ transform() มาด้วยเสมอ
  // transform() ก็คือ method ที่เราจะใช้ในการแปลงข้อมูลของเรานั่นเอง
  // โดยเราจะรับ argument 2 ตัว คือ data, metadata
  // data ก็คือข้อมูลดิบที่เราจะเอามาแปลง (เหมือนลูกมันฝรั่ง)
  // ส่วน metadata ก็คือข้อมูลสำคัญของ data ของเรา
  // คำว่าข้อมูลสำคัญที่ว่าจะมีให้เลือกสามตัวคือ data, type และ datatype
  // data ก็คือ string ที่ถูกส่งเข้ามาใน Decorator ที่เราใช้ Extract ข้อมูล
  // เช่น @Body('id') metadata.data ของเราก็คือ 'id'
  // type ก็คือตัว Decorator ที่เราใช้ Extract ข้อมูล
  // มี 4 ประเภทคือ 'body', 'query', 'param', 'custom'
  // ถ้าเราใช้ @Body(), @Query(), @Param() เราก็จะได้ metadata.type 'body', 'query', 'param' ตามลำดับ
  // แต่ถ้าวิธีอื่น ๆ เราจะได้ 'custom' มาแทน
  // เช่น @Param('id') เราก็จะได้ metadata object: { type: 'param', data: 'id' }
  // ส่วนตัวสุดท้ายคือ metatype ก็คือ type ที่เราผูกเอาไว้กับตัวแปรที่เราสร้างด้านหลัง ()
  // เช่น @Param() age: number แปลว่า metatype เราจะมี type เป็น Number
  // แต่ถ้าเรา log ออกมาดูว่า metadata.metatype คืออะไร เราจะได้ function Number() { [native code] }
  // ซึ่งรวม ๆ แล้วมันก็คือ Type เรานั่นแหละ
  // สรุปแล้ว สมมติ @Body('name') name: string เราจะได้ข้อมูลตามด้านล่างต่อไปนี้
  // metadata.data = 'name'
  // metadata.type = 'body'
  // metadata.metatype = function String() { [native code ] } หรือ String type
  // เราสามารถนำข้อมูลพวกนี้มาเขียน condition ในการตรวจสอบข้อมูลใน Pipe ได้
  // ส่วนเรื่องของ Global Pipe ก็แค่ใช้คำสั่ง .useGlobalPipe() กับ app และส่งค่า Pipe ไปให้มันผ่าน () แค่นั้น
  transform(data: any, metadata: ArgumentMetadata) {
    if (metadata.metatype === String) {
      // แล้วเราก็แปลงข้อมูลและส่งข้อมูลที่เราอยากได้กลับ เป็นอันเสร็จสิ้น
      // ส่วนการนำไปใช้ ให้อ่านต่อได้ที่ pipes-chapter.controller.ts
      return `${data} has data: ${metadata.data}, type: ${metadata.type} and metatype: ${metadata.metatype}`;
    }
  }
}
