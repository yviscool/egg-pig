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

### other Decorators
```js
import { Controller } from 'egg';
import { Context, Request, Response, Param, Query, Body } from 'egg-pig';

export default class HomeController extends Controller {
  public async index(
    @Context() ctx,
    @Request() req,
    @Response() res,
    @Param() param,
    @Query() query,
    @Body() body
  ) {

  }
}
*** 
