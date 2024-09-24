import {
  ArgumentMetadata,
  ForbiddenException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class IsStringPipe implements PipeTransform {
  transform(data: any, metadata: ArgumentMetadata) {
    if (typeof data === 'string') {
      return data;
    } else {
      throw new ForbiddenException();
    }
  }
}
