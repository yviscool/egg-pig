import { Interceptor, EgggInterceptor, HttpException, HttpStatus } from 'egg-pig';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/throw';

@Interceptor()
export class TransformInterceptor extends EgggInterceptor {
    intercept(_, __, stream$) {
        return stream$.catch(_=>
            Observable.throw(
                new HttpException(
                    'Exception interceptor message',
                    HttpStatus.BAD_GATEWAY,
                ),
            ),
        );
    }
}
