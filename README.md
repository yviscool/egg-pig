# egg-pig
Pipe, Interceptor, Guard Decorators for egg.js 

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

## use 
you can  see [nest.js](https://docs.nestjs.com/).

### Guard

```js
import { BaseContextClass } from 'egg';
import { Guard, UseGuards } from 'egg-pig';

@Guard()
export class XXGuard extends BaseContextClass {
  canActivate(req, context){
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
import { Pipe, UsePipes, Param, Query, Body } from 'egg-pig';

@Pipe()
class XXPipe extends BaseContextClass {
  async transform(val, metadata) {
    return val;  //validate val or transform val
  }
}

@UsePipes(XXPipe)
export default class HomeController extends Controller {
  // @UsePipes(XXPipe)
  public async index(@Param('xx', XXPipe) param; @Body('xx', XXPipe) body, @Query(XXPipe) quey) {
    // some logic
  }
}
```

### Interceptor

```js
import { UseInterceptors, Interceptor } from 'egg-pig';
import 'rxjs/add/operator/do';

@Interceptor()
class XXInterceptor extends BaseContextClass {
  async intercept(req, context, stream$) {
    console.log('Before...', );
    const now = Date.now();

    return stream$.do(
      () => console.log(`After... ${Date.now() - now}ms`),
    );
  }
}

@UseInterceptors(XXInterceptor)
export default class HomeController extends Controller {

  //@UseInterceptors(XXInterceptor)
  public async index() {
    // some login
  }
}
```

### Other Decorators
```js
import { Controller } from 'egg';
import { Context, Request, Response, Param, Query, Body, Session, Headers } from 'egg-pig';

export default class HomeController extends Controller {
  public async index(
    @Context() ctx,
    @Request() req,
    @Response() res,
    @Param() param,
    @Query() query,
    @Body() body,
    @Session() session,
    @Headers() headers,
  ) {
    // ctx = this.ctx;
    // req=  this.ctx.req 
    // res = this.ctx.res
    // param = this.ctx.params
    // query = this.ctx.query
    // body = this.ctx.request.body
    // session = this.ctx.session
    // headers = this.ctx.headers
  }
}
```

## Route
configure `xxx/config/config.default.js` to enable:
```js
config.eggpig = {
  route: true,
}
```

### Controller

```js
import { BaseContextClass } from 'egg';
import {  Controller, Get, Post, Body, Param } from 'egg-pig';

@Controller('cats') // => /cats
export default class CatsController extends BaseContextClass{

  @Get()  // => router.get('/cats', index)
  async index(){
    this.ctx.body = 'index'; 
  }

  @Get('/get')   // => router.get('/cats/get', get)
  async get(){
    this.ctx.body = 'add'; 
  }
  
  @Post('/add')   // => router.post('/cats/add', add)
  async add(@Body() body){
    this.ctx.body = body; 
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
    this.ctx.body = param; 
  }
}

```
if you open `/cats/12` then `ctx.body = 12`

### restful

```js
import { BaseContextClass } from 'egg';
import {  Resources, Get } from 'egg-pig';

@Resources('cats')    // => router.resources(''cats', /cats',CastController)
export default class CatsController extends BaseContextClass{

  async index(){  
    this.ctx.body = 'index';
  }

  async new(){
    this.ctx.body = 'new';
  }

  @Get('/add')    //  router.get('/cats/add', add)
  async add(){
    this.ctx.body = 'add'; 
  }

}

```
Use route name `@Resources('cats', '/cats')`
You can also use `@Restful()` Decorator, the same as Resources;

### multiple middleware

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













