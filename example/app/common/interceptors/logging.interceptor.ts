import { Interceptor, EgggInterceptor} from 'egg-pig';
import 'rxjs/add/operator/do';

// console.log(Observable.prototype);

@Interceptor()
export class LoggingInterceptor extends EgggInterceptor {
  intercept(_, __ , stream$) {
    console.log('Before...');
    const now = Date.now();

    return stream$.do(() => console.log(`After... ${Date.now() - now}ms`));
  }
}