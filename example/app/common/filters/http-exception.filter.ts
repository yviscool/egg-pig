import { ExceptionFilter, Catch, HttpException } from 'egg-pig';

@Catch(HttpException)
export class HttpExceptionFilter extends ExceptionFilter {
    catch(exception: HttpException) {
        const { ctx } = this;
        const status = exception.getStatus();
        ctx.status = status;
        ctx.body = {
            statusCode: status,
            message: `It's a message from the exception filter`,
        }
    }
}
