"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const tslib_1 = require("tslib");
const operators_1 = require("rxjs/operators");
const egg_pig_1 = require("../../../../../");

exports.default = (appInfo) => {
    const config = {};
    // app special config
    config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${appInfo.name}`;
    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1523969653835_3209';
    // add your config here
    config.middleware = [];
    config.security = {
        csrf: false
    };
    config.view = {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.tpl': 'nunjucks',
        },
    };
    config.multipart = {
        mode: 'file',
    };
    // config.globalPrefix = 'api/v1'
    class Guard {
        canActivate(context) {
            if (this['ctx'].url === '/global/guard') {
                context;
                return false;
            }
            return true;
        }
    }
    class Pipe {
        transform(value, metadata) {
            if (/\/global\/pipe.*?/.test(this['ctx'].url)) {
                metadata;
                return 2;
            }
            return value;
        }
    }
    class Interceptor {
        intercept(context, call$) {
            if (this['ctx'].url === '/global/interceptor') {
                return call$.pipe(operators_1.map(data => ({
                    'global': 'global'
                })));
            }
            return call$.pipe(operators_1.tap(data => ({
                data
            })));
        }
    }
    class ForbiddenException extends egg_pig_1.HttpException {
        constructor() {
            super('Forbidden', egg_pig_1.HttpStatus.FORBIDDEN);
        }
    }
    let HttpExceptionFilter = class HttpExceptionFilter extends egg_pig_1.ExceptionFilter {
        catch (exception) {
            const ctx = this['ctx'];
            if (this['ctx'].url === '/global/filter') {
                const status = exception.getStatus();
                ctx.status = status;
                ctx.body = {
                    statusCode: status,
                    message: `It's a message from the exception filter`,
                };
            }
            ctx.status = exception.getStatus();
            ctx.body = {
                statusCode: exception.getStatus(),
                message: exception.getResponse()
            };
        }
    };
    HttpExceptionFilter = tslib_1.__decorate([
        egg_pig_1.Catch(ForbiddenException)
    ], HttpExceptionFilter);
    config.globalGuards = [class {
        canActivate(context) {
            return true;
        }
    }, new Guard()];
    config.globalPipes = [class {
        transform(value, metadata) {
            return value;
        }
    }, new Pipe()];
    config.globalInterceptors = [
        class {
            intercept(context, call$) {
                return call$.pipe(operators_1.tap(data => {}));
            }
        },
        new Interceptor()
    ];
    config.globalFilters = [new HttpExceptionFilter()];
    return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25maWcuZGVmYXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVVBLGtCQUFlLENBQUMsT0FBcUIsRUFBRSxFQUFFO0lBQ3ZDLE1BQU0sTUFBTSxHQUFHLEVBQTRDLENBQUM7SUFFNUQscUJBQXFCO0lBQ3JCLE1BQU0sQ0FBQyxTQUFTLEdBQUcsaURBQWlELE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUVuRiwwQ0FBMEM7SUFDMUMsdUVBQXVFO0lBQ3ZFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQztJQUVuRCx1QkFBdUI7SUFDdkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFHdkIsTUFBTSxDQUFDLE1BQU0sR0FBRztRQUNkLEdBQUcsRUFBRSxJQUFJO1FBQ1QsS0FBSyxFQUFFLElBQUk7S0FDWixDQUFBO0lBR0QsTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNoQixJQUFJLEVBQUUsS0FBSztLQUNaLENBQUE7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUMifQ==