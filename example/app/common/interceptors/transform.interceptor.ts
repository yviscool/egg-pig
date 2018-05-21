import { Injectable, EggInterceptor, ExecutionContext } from 'egg-pig';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor extends EggInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    context;
    return call$.pipe(map(data => ({ data })));
  }
}
