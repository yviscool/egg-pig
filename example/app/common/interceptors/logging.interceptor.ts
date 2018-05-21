import { Injectable, EggInterceptor, ExecutionContext} from 'egg-pig';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// console.log(Observable.prototype);

@Injectable()
export class LoggingInterceptor extends EggInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {

    console.log('Before...');
    console.log(context);

    const now = Date.now();
    return call$.pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
