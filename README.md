# egg-pig
nest.js int egg.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage][coverage-image]][coverage-url]

[npm-image]: https://img.shields.io/npm/v/egg-pig.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-pig
[travis-image]: https://travis-ci.org/yviscool/egg-pig.svg?branch=master
[travis-url]: https://travis-ci.org/yviscool/egg-pig
[coverage-url]: https://codecov.io/gh/yviscool/egg-pig
[coverage-image]: https://codecov.io/gh/yviscool/egg-pig/branch/master/graph/badge.svg

## Install 
```bash
$ npm i egg-pig --save
```

## Configuation

configure `xxx/config/plugin.js` to enable:

```js
  eggpig: {
    enable: true,
    package: 'egg-pig'
  }
```

### Param Decorators
```js
import { Controller } from 'egg';
import { Context, Request, Response, Param, Query, Body, Session, Headers, Res, Req, UploadedFile, UploadedFiles } from 'egg-pig';

export default class HomeController extends Controller {
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

### return value

```js
@Controller('cats')
export default class CatsController extends BaseContextClass{

  @Get('/add')  // router.get('/cats/add', add)
  async add(){
    return 'zjl'; // this.ctx.body = 'zjl;
  }
  
  @Get('bar')    // router.get('/cats/foo', foo)
  async foo(){  
    return await this.service.xxx.yyy(); // this.ctx.body = '';
  }
}

```
use return value replace ctx.body;

### Controller

```js
import { BaseContextClass } from 'egg';
import {  Controller, Get, Post, Body, Param } from 'egg-pig';

@Controller('cats') // => /cats
export default class CatsController extends BaseContextClass{

  @Get()  // => router.get('/cats', index)
  async index(){
    this.ctx.body = 'index'; 
    // or return 'index'
  }

  @Get('get')   // => router.get('/cats/get', get)
  async get(){
    return 'add'
    // or this.ctx.body = 'add'; 
  }
  
  @Post('/add')   // => router.post('/cats/add', add)
  async add(@Body() body){
    return body;
     // or this.ctx.body = body;
  }
  
}

```

### route name

```js
import { BaseContextClass } from 'egg';
import {  Controller, Get, Param } from 'egg-pig';

@Controller('cats')
export default class CatsController extends BaseContextClass{

  @Get('cats',':id') // router.get('cats', '/cats/:id', index)
  async index(@Param('id') param){
    return param;
  }
}

```
if you open `/cats/12` then `ctx.body = 12`

### restful

```js
import { BaseContextClass } from 'egg';
import {  Resources, Get } from 'egg-pig';

@Resources('cats')    // => router.resources(''cats', /cats', CastController)
// or @Restful('cats')
export default class CatsController extends BaseContextClass{

  async index(){  
    return 'index';
  }

  async new(){
    return 'new';
  }

  @Get('/add')    //  router.get('/cats/add', add)
  async add(){
    return 'add';
  }

}

```
Use route name `@Resources('cats', '/cats')`
You can also use `@Restful()` Decorator, the same as Resources;

### multiple middleware

```js
import { Application } from 'egg';
import { MiddlewareConsumer } from 'egg-pig';


export default (app: Application) => {

  const { router,controller, middleware} = app;

  MiddlewareConsumer

    .setRouter(router)
    
    .apply(middleware.log())

    // router.all('xxx/foo', log)
    // router.all('xxx/bar', log)
    .forRoutes(
      'xxx/foo',
      'xxx/bar',
    )  

    .apply(middleware.log(), middleware.logXX())

    // router.all('foo/xxMethod', log, logXX)
    // router.all('foo/yyMethod', log, logXX)
    .forRoutes(controller.foo)

    .apply(...)
    .forRoutes(
      'xxx/foo',
      'xxx/bar',
      controller.foo,
      controller.bar,
      {path:'xxx/yyy'}
    )

    ..
}

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
export default class CatsController extends BaseContextClass{

  @Get('/add')
  async add(){
    this.ctx.body = 'add'; 
  }
}

```

### render 

```js
import { BaseContextClass} from 'egg';
import { Render,Controller, Get } from 'egg-pig';

@Controller('home')
export default class HomeController extends BaseContextClass{

  @Get()   // /home
  @Render('list.tpl')
  public async index() {
    const dataList = {
      list: [
        { id: 1, title: 'this is news 1', url: '/news/1' },
        { id: 2, title: 'this is news 2', url: '/news/2' }
      ]
    };
    return dataList;
  }
}
```

## use 
you can see [nest.js](https://docs.nestjs.com/).

### Guard

```js
import { BaseContextClass } from 'egg';
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
import { BaseContextClass } from 'egg';
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

### filter 

```js

import { BaseContextClass } from 'egg';
import {
  Controller,
  Get,
} from 'egg-pig';


@Controller('cats')
export default class CatsController extends BaseContextClass {

  @Get()
  async foo(){
    throw new Error('some ..')
  }  
}
```
in this case eggjs will hanlde ;

```js
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from 'egg-pig';

@Controller('cats')
export default class CatsController extends BaseContextClass {
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
    hrow new ForbiddenException()
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
export default class CatsController extends BaseContextClass {
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
export default class HomeController extends BaseContextClass {
  @Get()
  public async index(@User('test', APipe) user){
    return user;
  }
}

```

