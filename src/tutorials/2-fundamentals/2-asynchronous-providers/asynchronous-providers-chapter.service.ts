// ในการสร้าง dynamic provider เราสามารถใช้ async / await ได้
// แค่ใส่ async หน้า () ของ arrow function ใน useFactory
// และในการ inject ส่วนมากจะใช้ @Inject() ซึ่งหมายความว่า token ของเราจะเป็น string
export const AsynchronousProvidersChapterService = {
  provide: 'ASYNC_PROVIDER',
  useFactory: async (): Promise<number> => {
    const a = await (1 + 2);
    return a;
  },
};
