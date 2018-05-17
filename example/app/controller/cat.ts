import { BaseContextClass } from 'egg';

import { HttpException, HttpStatus, } from 'egg-pig';

import {
  Controller,
  Get,
  UseFilters,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from 'egg-pig';

import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';



@Controller('cats')
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export default class CatsController extends BaseContextClass {

  @Post('post')
  @Roles('admin')
  async create(@Body() createCat) {
    return createCat;
  }

  @Get('some/throw')
  @UseFilters(HttpExceptionFilter)
  async foo() {
    throw new HttpException('方法不允许', HttpStatus.METHOD_NOT_ALLOWED);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    return id;
  }

}