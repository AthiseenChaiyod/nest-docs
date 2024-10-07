import { Controller, Get } from '@nestjs/common';
import { LazyLoadingModulesChapterService } from './lazy-loading-modules-chapter.service';
import { LazyLoadingModulesProviderService } from './lazy-loading-modules-provider/lazy-loading-modules-provider.service';

@Controller('lazy-loading-modules')
export class LazyLoadingModulesChapterController {
  constructor(private lazyLoadingService: LazyLoadingModulesChapterService) {}

  @Get()
  async useLazyLoad() {
    // ด้วยความที่ .load() จะส่งค่า Promise<T> กลับมา ทำให้เราต้องจัดการกับ Promise เอาเอง
    // เผื่อลืมว่าการเขียน Arrow function ใน Async เราก็ต้องเขียนส่งค่ากลับด้วย
    return await this.lazyLoadingService.useLazyLoad().then((data) => {
      return data.get(LazyLoadingModulesProviderService).getIndex();
    });
  }
}
