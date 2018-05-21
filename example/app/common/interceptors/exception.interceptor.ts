import { Injectable, EggInterceptor, HttpException, HttpStatus, ExecutionContext } from 'egg-pig';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor extends EggInterceptor {
    intercept(context: ExecutionContext, stream$: Observable<any>) {
        context ;
        return stream$.pipe(
            catchError(err =>
              throwError(new HttpException('Message', HttpStatus.BAD_GATEWAY)),
            ),
          );
    }
}
