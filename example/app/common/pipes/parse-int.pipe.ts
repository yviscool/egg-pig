import { Pipe,PipeTransform, HttpException, HttpStatus } from 'egg-pig';

@Pipe()
export class ParseIntPipe extends PipeTransform {
  async transform(value, _) {
    const val = parseInt(value, 10);
    if (!val) {
      throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST);
    }
    return val;
  }
}
