import { Inject, Injectable } from '@nestjs/common';
import { DynamicModulesChapterInterface } from './dynamic-modules-chapter.interface';

@Injectable()
export class DynamicModulesChapterService {
  constructor(
    // ถ้าเรากำหนด custom provider เอาไว้ เราก็สามารถนำข้อมูลมาใช้ได้
    @Inject('REGISTER_OPTIONS') private options: DynamicModulesChapterInterface,
  ) {}

  getFirstName() {
    return this.options.first_name;
  }

  getLastName() {
    return this.options.last_name;
  }

  getAge() {
    return this.options.age;
  }

  getGender() {
    return this.options.gender;
  }
}
