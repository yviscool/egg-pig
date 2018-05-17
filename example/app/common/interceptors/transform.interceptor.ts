import { Interceptor, EgggInterceptor } from 'egg-pig';
import 'rxjs/add/operator/map';

@Interceptor()
export class TransformInterceptor extends EgggInterceptor {
  intercept(_, __, stream$) {
    return stream$.map(data => ({ data }));
  }
}
