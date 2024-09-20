import { z } from 'zod';

// การสร้าง Dto ของ Zod จะต่างกับที่เราสร้างปกติ
// แทนที่จะใช้ interface / class เราจะใช้ const โดยตรงเลย
// แล้วใช้คำสั่ง z.object() เพื่อสร้าง Object Schema ของเราขึ้นมาแทน
// โดยเราจะใส่ object เอาไว้ข้างใน object() ของ z
// ส่วน type แทนที่เราจะ : number ได้เลย เราจะต้องใช้คำสั่งของ z อีกเช่นกัน
// ให้เราใส่ z.<type>() แทน type ปกติ เช่น z.string(), z.boolean(), etc.
// ตัวอย่างการสร้าง object ด้วย z คือ z.object({ color: z.string, available: z.boolean })
// ด้านหลังของ z.object() เราสามารถ method chaining ต่อได้ เช่น z.object().required()
// เท่านี้เราก็ได้ object ที่จะมาสร้างเป็น schema แล้ว
export const pipesChapterSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    gender: z.string(),
  })
  .required();

// เราสร้าง z.object() แล้ว แต่ว่า z.object() นี้ไม่ใช่ type หลัก ๆ จะเอาไว้ส่งให้กับ Zod Instance อย่างเดียว
// ทำให้เราต้องมาสร้าง type เอาเองอีกรอบ แต่ว่าถ้าเขียนใหม่หมดเลยอีกรอบก็เสียเวลา โค้ดรกโดยใช่เหตุ
// เราเลยต้องเอา z.object() ที่เราสร้างมาแปลงเป็น type
// โค้ดสั้นกว่า แถม reuse โค้ดที่เราเขียนได้แต่เดิมได้ด้วย สองเด้งเลย
// อันดับแรกก็ให้เราสร้าง export type ก่อน เพราะเราจะสร้าง type ขึ้นมาจาก const object
// จากนั้นก็กำหนดค่าให้กับมันว่า type ของเราจะมีหน้าตาเป็นแบบไหน
// ตอนนี้คือจังหวะที่เราจะนำ const object ของเรามาแปลงเป็น type
// เราจะใช้ z.infer<typeof z.object()> ในการแปลง z.object() เป็น type
// เหตุผลที่เราต้องใช้ typeof หน้า z.object() ของเราก็เพราะว่า z.infer รับค่า type ZodType
// ZodType จะคนละตัวกับ ZodSchema
// ZodSchema ก็คือ Object ที่เราสร้างด้วย Zod หรือก็คือ ZodObject
// ส่วน ZodType ก็คือ ZodObject ที่ถูกแปลงเป็น Type ด้วย typeof
// ด้วยเหตุผลนี้เราเลยต้องใส่ typeof เพื่อแปลง z.object() ของเราเป็น ZodType
// สรุปการสร้าง type จาก ZodObject ก็คือ
// อันดับแรก ให้เราสร้าง export type ขึ้นมาก่อนหนึ่งตัว
// จากนั้นจึงสร้าง type ให้กับมันด้วยคำสั่ง z.infer<typeof ZodObject>
// ซึ่ง ZodObject ก็คือ z.object() ที่เราสร้างเอาไว้ใช้ใน Zod Schema Validation ตั้งแต่แรกอยู่แล้ว
// ทำให้เราไม่ต้องไปสร้าง Dto แยกอีกตัวต่างหาก ใช้โค้ดที่เราเขียนไว้แต่เดิม
// ในการนำไปใช้ก็เรียกใช้เหมือน Type ปกติได้เลย เพราะมันกลายเป็น type จากการแปลงแล้ว
export type PipesChapterSchema = z.infer<typeof pipesChapterSchema>;
