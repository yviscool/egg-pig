import { Injectable, PipeTransform,  ArgumentMetadata, BadRequestException } from 'egg-pig';

@Injectable()
export class ParseIntPipe extends PipeTransform {
  async transform(value: string, metadata: ArgumentMetadata) {
    metadata;
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
