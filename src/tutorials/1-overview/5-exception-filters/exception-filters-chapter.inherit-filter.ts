import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { ExceptionFiltersChapterFilter } from './exception-filters-chapter.filter';

@Catch()
export class ExceptionFiltersChapterInheritFilter extends ExceptionFiltersChapterFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
