// นอกจากการประกาศ custom provider เอาไว้ข้างใน providers: [...] เราสามารถสร้าง object เอาไว้ก่อนได้
// หน้าตาก็จะเหมือนกับ custom provider ที่เราประกาศปกติเลย
// เราสามารถนำไปใส่ใน providers: [] ของ Module ได้ปกติ
const nonServiceBased = {
  provide: 'SOME_TOKEN',
  useFactory: () => {
    return 0;
  },
};
