import { CustomProvidersChapterNoIocService } from './custom-providers-chapter.service';

export class CustomProvidersChapterNoIocController {
  // ในการ inject เข้ามา เราจะต้องประกาศตัวแปรเอาไว้ข้างนอก constructor ก่อน
  // ถ้าเราไปประกาศข้างในทีเดียว เราจะไม่สามารถเรียกใช้ได้เพราะเข้าไม่ถึง scope
  private noIocService: CustomProvidersChapterNoIocService;

  // เสร็จแล้วเราจึงใส่ค่าให้มันได้ใน constructor โดยการสร้าง instance ของ service ขึ้นมาใหม่
  // แล้วเราจึงนำไปใช้ใน method ของเราได้เหมือนตอนที่เรา inject service เลย
  constructor() {
    this.noIocService = new CustomProvidersChapterNoIocService();
  }

  // ที่พิเศษกว่าคือโค้ด Routing
  // เราจะต้องไปเขียน app.use() เอาเองเหมือน Backend JS-based อื่น ๆ เช่น ElysiaJS
  // เช่น app.use('/get-index', (req, res) => { res.json(NameController.Method()) })
  // ซึ่งถ้าเกิดโค้ดเรามีหลาย route เขียนเยอะตายพอดี เพราะฉะนั้นให้เรารู้ไว้เฉย ๆ ว่าถ้าเขียนเองทำยังไง
  getIndex() {
    this.noIocService.getIndex();
  }
}
