import {
  Pipe,
  PipeTransform,
  HttpException,
  HttpStatus,
} from 'egg-pig';

@Pipe()
export class ValidationPipe extends PipeTransform {
  async transform(value, metadata) {
    const val = parseInt(value, 10);
    if (isNaN(val)){
      throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST);
    }
    return val;
  }
}
