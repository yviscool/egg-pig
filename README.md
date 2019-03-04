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
export default class CatsController {
    
    constructor(
        private ctx: Context,
        private app: Application,
        private config: EggAppConfig
        private service: IService,
    ) { }

    @Get()  // => router.get('/cats', index)
    async index() {
        this.ctx.body = 'index';
        // or return 'index'
    }

    @Get('get')   // => router.get('/cats/get', get)
    async get() {
        return 'add'
        // or this.ctx.body = 'add'; 
    }

    @Post('/add')   // => router.post('/cats/add', add)
    async add(@Body() body) {
        return body;
        // or this.ctx.body = body;
    }

}
```

another way 

```json
import { BaseContextClass } from 'egg';
import { Controller, Get, Post } from 'egg-pig';

@Controller('cats') // => /cats
export default class CatsController extends BaseContextClass{

    @Get()
    async index() {
        return await this.service.foo.bar();
    }
}
```

### return value

```js
@Controller('cats')
export default class CatsController {

    @Get('/add')  // router.get('/cats/add', add)
    async add() {
        return 'zjl'; // this.ctx.body = 'zjl;
    }

    @Get('bar')    // router.get('/cats/foo', foo)
    async foo() {
        return await this.service.xxx.yyy(); // this.ctx.body = '';
    }
}
```
use return value replace ctx.body;


### Param Decorators
```js
import { Context, Request, Response, Param, Query, Body, Session, Headers, Res, Req, UploadedFile, UploadedFiles } from 'egg-pig';

@Controller('cats')
export default class CatsController {
    public async index(
        @Context() ctx,
        @Ctx() ctx, // alias
        @Request() req,
        @Response() res,
        @Req() req, // alias
        @Res() res,// alias
        @Param() param,
        @Query() query,
        @Body() body,
        @Session() session,
        @Headers() headers,
        @UploadedFile() stream,
        @UploadedFiles() parts,
    ) {
        // ctx = this.ctx;
        // req=  this.ctx.request;
        // res = this.ctx.response;
        // param = this.ctx.params;
        // query = this.ctx.query;
        // body = this.ctx.request.body;
        // session = this.ctx.session;
        // headers = this.ctx.headers;
        // stream = await this.ctx.getFileStream();
        // parts = this.ctx.multipart();
    }
}
```


### route name

```js
import { Controller, Get, Param } from 'egg-pig';

@Controller('cats')
export default class CatsController {

    @Get('cats', ':id') // router.get('cats', '/cats/:id', index)
    async index(@Param('id') param) {
        return param;
    }
}
```
if you open `/cats/12` then `ctx.body = 12`

### restful

```js
import { Resources, Get } from 'egg-pig';

@Resources('cats')    // => router.resources(''cats', /cats', CastController)
// or @Restful('cats')
export default class CatsController {

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
Use route name `@Resources('cats', '/cats')`
You can also use `@Restful()` Decorator, the same as Resources;

### multiple-middleware

```js
import { Application } from 'egg';
import { MiddlewareConsumer, RequestMethod } from 'egg-pig';

export default (app: Application) => {

  const { router,controller, middleware, config} = app;

  MiddlewareConsumer

    .setRouter(router)
    
    .apply(middleware.log(config.xxx))

    // router.all('foo/bar', log)
    // router.all('foo/xxx', log)
    .forRoutes(
      'foo/bar',
      'foo/xxx',
    )  

    .apply(middleware.log(), middleware.logXX(confix.yyy))

    // router.xxx('controllerFoo/xxMethod', log, logXX)
    // router.xxx('controllerFoo/yyMethod', log, logXX)
    .forRoutes(controller.foo)

    .apply(middleware.log) 


    .forRoutes(
      { path:'xxx/yyy', method: RequestMethod.GET},
      { path:'xxx/zzz', method: RequestMethod.POST},
      'xxx/bar',
      controller.foo,
      controller.bar,
    )

    ..
}

```
Whilst class is used, quite often we might want to exclude certain routes. That is very intuitive due to the exclude() method.
```js
  ...
   MiddlewareConsumer
      .setRouter(router)
      .apply(middleware.bar)
      .exclude(
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
      )
      .forRoutes(controller.foo);
  ...
```

another way

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
export default class CatsController {

  @Get('/add')
  async add(){
    this.ctx.body = 'add'; 
  }
}

```

### render-header

```js
import { Render,Controller, Get, Header } from 'egg-pig';

@Controller('home')
export default class HomeController {

  @Get()   // /home
  @Render('list.tpl')
  async index() {
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
  async foo() {
    ...
  }

  @Header({
      'Etag': '1234',
      'Last-Modified': new Date(),
  })
  @Get('other')
  async bar() {
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
export default class HomeController extends Controller {
  // @UseGuards(XXGuard)
  public async index() {
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
export default class HomeController extends Controller {
  // @UsePipes(XXPipe)
  async index(@Param('xx', XXPipe) param; @Body('xx', XXPipe) body, @Query(XXPipe) quey) {
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
export default class PipetestController {

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
  [class-validator](https://github.com/yviscool/understanding-nest/blob/master/book/3.1%20class-validator%20%E8%A7%A3%E6%9E%90%E4%BB%A5%E5%8F%8A%20validaiton.pipe%20%E4%BD%BF%E7%94%A8.md)/
  [class-transformer](https://github.com/yviscool/understanding-nest/blob/master/book/3.2%20class-transformer%20%E8%A7%A3%E6%9E%90.md)


### Interceptor

```js
import { EggInterceptor, UseInterceptors, Interceptor} from 'egg-pig';
import { Injectable, EggInterceptor, ExecutionContext } from 'egg-pig';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

@Injectable()
class LoggingInterceptor extends EggInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    return call$.pipe(
      tap(() => console.log(`After... ${Date.now() - now}ms`)),
    );
  }
}

@UseInterceptors(LoggingInterceptor)
export default class HomeController extends Controller {

  //@UseInterceptors(LoggingInterceptor)
  public async index() {
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
export default class SerializerController {

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
export default class CatsController {

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
export default class CatsController {
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
export default class CatsController {
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
export default class HomeController {
  @Get()
  public async index(@User('test', APipe) user){
    return user;
  }
}

```
