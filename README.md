# egg-pig
nest.js in egg.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage][coverage-image]][coverage-url]

[npm-image]: https://img.shields.io/npm/v/egg-pig.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-pig
[travis-image]: https://travis-ci.org/yviscool/egg-pig.svg?branch=master
[travis-url]: https://travis-ci.org/yviscool/egg-pig
[coverage-url]: https://codecov.io/gh/yviscool/egg-pig
[coverage-image]: https://codecov.io/gh/yviscool/egg-pig/branch/master/graph/badge.svg

* [Installation](#installation)
    - [Config](#Config)
* [Usage](#usage)
  + [Controller](#controller)
  + [Return value](#return-value)
  + [Param Decorators](#param-decorators)
  + [Route name](#route-name)
  + [Restful](#restful)
  + [Multiple Middleware](#multiple-middleware)
  + [Render Header](#render-header)
* [Guard](#guard)
* [Pipe](#pipe)
  + [Build-in ValidationPipe](#build-in-balidationpipe)
* [Interceptor](#interceptor)
  + [Build-in interceptor](#build-in-interceptor)
* [Filter](#filter)
* [Tips](#tips)
* [Global](#global)
* [Custom Decorators](#custom-decorators)

## Installation 

```bash
$ npm i egg-pig --save
```

### Config

```js
// app/config/plugin.js
eggpig: {
  enable: true,
  package: 'egg-pig'
}
```

## Usage 

### Controller

```js
import { IService, EggAppConfig, Application, Context } from 'egg';
import { Controller, Get, Post } from 'egg-pig';

@Controller('cats') // => /cats
export class CatsController {
    
    constructor(
        private ctx: Context,
        private app: Application,
        private config: EggAppConfig,
        private service: IService,
    ) { }

    @Get()  // => router.get('/cats', index)
    async index() {
        this.ctx.body = 'index';
        // or return 'index'
    }

    @Get('get')   // => router.get('/cats/get', foo)
    async foo() {
        return 'add'
        // or this.ctx.body = 'add'; 
    }

    @Post('/add')   // => router.post('/cats/add', bar)
    async bar(@Body() body) {
        return body;
        // or this.ctx.body = body;
    }

}
```

another way 

```js
import { BaseContextClass } from 'egg';
import { Controller, Get, Post } from 'egg-pig';

@Controller('cats') // => /cats
export class CatsController extends BaseContextClass{

    @Get()
    async foo() {
        return await this.service.foo.bar();
    }
}
```

### return value

```js
@Controller('cats')
export class CatsController {

    @Get('/add')  // router.get('/cats/add', foo)
    async foo() {
        return 'zjl'; // this.ctx.body = 'zjl;
    }

    @Get('bar')    // router.get('/cats/foo', bar)
    async bar() {
        return await this.service.xxx.yyy(); // this.ctx.body = '';
    }
}
```
use return value replace ctx.body;


### Param Decorators
```js
import { Context, Request, Response, Param, Query, Body, Session, Headers, Res, Req, UploadedFile, UploadedFiles, UploadedFileStream, UploadedFilesStream } from 'egg-pig';

@Controller('cats')
export class CatsController {
    public async foo(
        @Request() req,
        @Response() res,
        @Req() req, // alias
        @Res() res,// alias
        @Param() param,
        @Query() query,
        @Body() body,
        @Session() session,
        @Headers() headers,
        @UploadedFile() file,
        @UploadedFiles() fils,
        @UploadedFileStream() stream,
        @UploadedFilesStream() parts
    ) {
        // req=  this.ctx.request;
        // res = this.ctx.response;
        // param = this.ctx.params;
        // query = this.ctx.query;
        // body = this.ctx.request.body;
        // session = this.ctx.session;
        // headers = this.ctx.headers;
        // file = this.ctx.request.files[0]
        // files = this.ctx.request.files;
        // stream = await this.ctx.getFileStream();
        // parts = this.ctx.multipart();
    }
}
```


### route name

```js
import { Controller, Get, Param } from 'egg-pig';

@Controller('cats')
export class CatsController {

    @Get(':id',{ routerName: 'cats'}) // router.get('cats', '/cats/:id', foo)
    async foo(@Param('id') param) {
        return param;
    }
}
```

### restful

```js
import { Resources, Get } from 'egg-pig';

@Resources('cats')    // => router.resources(''cats', /cats', CastController)
// or @Restful('cats')
export class CatsController {

    async index() {
        return 'index';
    }

    async new() {
        return 'new';
    }

    @Get('/add')    //  router.get('/cats/add', add)
    async add() {
        return 'add';
    }

}
```
You can also use `@Restful()` Decorator, the same as Resources;

### multiple-middleware


1. use  decorator router options 

```ts
@Controller('/', {middleware: ['homeMiddleware']})   //  this.app.middleware['homeMiddleware']
export class Test {
    
  @Get('/', {middleware: ['apiMiddleware']})  // this.app.middleware['apiMiddleware']
  async index() {
    const ctx = this.ctx;
    return ctx.home + ctx.api;
  }
   
}
```

2. use koa-router feature 

```js
// router.ts
export default (app:Application) => {

  const { router } = app;

  router.get('/cats/add', async (_,next) => {
    console.log('this is middleware');
    return next();
  });

};


// cats.ts
@Controller('cats')
export class CatsController {

  @Get('/add')
  async foo(){
    this.ctx.body = 'add'; 
  }
}

```

### render-header

```js
import { Render,Controller, Get, Header } from 'egg-pig';

@Controller('home')
export class HomeController {

  @Get()   // /home
  @Render('list.tpl')
  async foo() {
    const dataList = {
      list: [
        { id: 1, title: 'this is news 1', url: '/news/1' },
        { id: 2, title: 'this is news 2', url: '/news/2' }
      ]
    };
    return dataList;
  }

  @Header('ETag','123')
  @Get('etag')
  async bar() {
    ...
  }

  @Header({
      'Etag': '1234',
      'Last-Modified': new Date(),
  })
  @Get('other')
  async baz() {
      ...
  }
}
```

## use 
you can see [nest.js](https://docs.nestjs.com/).

### Guard

```js
import { Injectable, CanActivate, ExecutionContext, UseGuards } from 'egg-pig';
import { Observable } from 'rxjs/Observable';

@Injectable()
class XXGuard extends CanActivate{
  canActivate(context: ExecutionContext)
  : boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}

@UseGuards(XXGuard)
export class HomeController {
  // @UseGuards(XXGuard)
  public async foo() {
    // some logic
  }
}
```


### Pipe
```js
import { PipeTransform, Injectable, ArgumentMetadata, UsePipes, Param, Query, Body  } from 'egg-pig';

@Injectable()
class XXPipe extends PipeTransform{
  async transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}

@UsePipes(XXPipe)
export class HomeController {
  // @UsePipes(XXPipe)
  async foo(@Param('xx', XXPipe) param; @Body('xx', XXPipe) body, @Query(XXPipe) quey) {
    // some logic
  }
}
```

#### Build-in ValidationPipe

```js
import { ParseIntPipe, ValidationPipe } from 'egg-pig';
import { IsInt, IsString, Length } from "class-validator";

class User {

    @IsInt()
    age: number;

    @Length(2, 10)
    firstName: string;

    @IsString()
    lastName: string;

    getName() {
        return this.firstName + ' ' + this.lastName;
    }

}

@Controller('pipetest')
export class PipetestController {

    @Get('parseint')
    async foo(@Query('id', ParseIntPipe) id) {
        return id;
    }

    @Post('validation')
    async bar(@Body(new ValidationPipe({ transform: true })) user: User) {
        return user.getName();
    }

}
```

Notice You may find more information about the 
  [class-validator](https://github.com/typestack/class-validator)/
  [class-transformer](https://github.com/typestack/class-transformer)


### Interceptor

```js
import { EggInterceptor, UseInterceptors, Interceptor} from 'egg-pig';
import { Injectable, EggInterceptor, ExecutionContext, CallHandler } from 'egg-pig';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

@Injectable()
class LoggingInterceptor extends EggInterceptor {
  intercept(
    context: ExecutionContext,
    call$: CallHandler,
  ): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    return call$.handle().pipe(
      tap(() => console.log(`After... ${Date.now() - now}ms`)),
    );
  }
}

@UseInterceptors(LoggingInterceptor)
export class HomeController {

  //@UseInterceptors(LoggingInterceptor)
  public async foo() {
    // some login
  }
}
```

#### Build-in interceptor 

```js
import { UseInterceptors, ClassSerializerInterceptor } from 'egg-pig';

class RoleEntity {
    id: number;
    name: string;
    constructor(partial: Partial<RoleEntity>) {
        Object.assign(this, partial);
    }
}

class UserEntity {
    id: number;
    firstName: string;
    lastName: string;

    @Exclude()
    password: string;

    @Expose()
    get fullName() {
        return `${this.firstName} ${this.lastName}`
    }
    @Transform(role => role.name)
    role: RoleEntity

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}


@Controller('serializer')
@UseInterceptors(new ClassSerializerInterceptor())
export class SerializerController {

    @Get()
    async foo() {
        return [new UserEntity({
            id: 1,
            firstName: 'jay',
            lastName: 'chou',
            password: '123456',
            role: new RoleEntity({ id: 1, name: 'admin' })
        }), new UserEntity({
            id: 2,
            firstName: 'kamic',
            lastName: 'xxxla',
            password: '45678',
            role: new RoleEntity({ id: 2, name: 'user01' })
        })]
    }
}
```

### filter 

```js

import { Controller, Get } from 'egg-pig';


@Controller('cats')
export class CatsController {

  @Get()
  async foo(){
    throw new Error('some ..')
  }  
}
```
When the client calls this endpoint,the eggjs will hanlde.

```js
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from 'egg-pig';

@Controller('cats')
export class CatsController {
  @Get()
  async foo(){
     throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }  
}
```
When the client calls this endpoint, the response would look like this:
```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

another way

```js
  async foo(){
    throw new HttpException({
     status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }, 403);
  }  
```

```js
class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}

async foo(){
    throw new ForbiddenException()
}  
```

**UseFilters**

```js
import { Controller, Get, HttpException, HttpStatus, ExceptionFilter, UseFilters, Catch } from 'egg-pig';

@Catch(HttpException)
class HttpExceptionFilter extends ExceptionFilter {
  catch(exception) {
    this.ctx.status = HttpStatus.FORBIDDEN;
    this.ctx.body = {
      statusCode: exception.getStatus(),
      timestamp: new Date().toISOString(),
      path: ctx.req.url
    }
  }
}

class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}


@Controller('cats')
@UseFilters(HttpExceptionFilter)
export class CatsController {
  @Get()
  async foo(){
    throw new ForbiddenException();
  }  
}
```

### tips
CanActivate, EgggInterceptor, PipeTransform,  ExceptionFilter are all abstract class which extends `egg/BaseContextClass`, it means you can use this on methods . such as 

```js 
class XXPipe extends PipeTransform{
  async transform(value, metadata){
    await this.service.foo.bar();
    console.log(this.config)
    this.foo(); 
    return value;
  }
  foo(){
    // logic
  }
}
```

### global

global prefix/guards/pipes/interceptors/filters

```js
// config.defalut.js
export default (appInfo: EggAppConfig) => {

  config.globalPrefix = '/api/v1';

  config.globalGuards = [new FooGuard(), FooGuard];

  config.globalPipes = [new FooPipe(), FooPipe];

  config.globalInterceptors = [new FooIn(), FooIn];

  config.globalFilters = [new FooFilter(), FooFilter]

  return config;
};

```

### Custom Decorators

```js 
import { BaseContextClass } from 'egg';
import { Controller, Get, PipeTransform, Pipe, createParamDecorator } from 'egg-pig';

const User = createParamDecorator((data, ctx) => {
  // data = 'test' => @User('test')
  return ctx.user;
});

@Pipe()
class APipe extends PipeTransform {
  transform(val, metadata) {
    // val => ctx.user;
    val && metadata;
    return val;
  }
}


@Controller('user')
export class HomeController {
  @Get()
  public async index(@User('test', APipe) user){
    return user;
  }
}

```
