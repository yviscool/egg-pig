'use strict';
const is = require('is-type-of');
const { HttpException } = require('../exceptions/exception');


class ExceptionHanlder {

  static create(filters) {

    return new ExceptionHanlder(filters);

  }

  constructor(filters = []) {
    this.filters = filters;
  }

  next(exception, app) {
    const { ctx } = app;
    if (this.invokeCustomFilters(exception, app)) return;
    // common throw error
    if (!(exception instanceof HttpException)) throw exception;
    // custom exception which extends HttpException
    const res = exception.getResponse();
    const message = is.object(res)
      ? res
      : {
        statusCode: exception.getStatus(),
        message: res,
      };

    ctx.status = exception.getStatus();
    if (is.nullOrUndefined(message)) {
      ctx.body = '';
      return;
    }
    ctx.body = is.object(message) ? message : String(message);
    return;
  }

  invokeCustomFilters(exception, app) {
    if (!this.filters.length) return false;
    let filter = this.filters.find(filter => {
      const exceptionMetatypes = filter.exceptionMetatypes;
      const hasMetatype =
        !exceptionMetatypes.length ||
        exceptionMetatypes.some(
          ExceptionMetatype => exception instanceof ExceptionMetatype
        );
      return hasMetatype;
    });
    if (filter) {
      filter = Object.assign(filter, app);
      filter.catch(exception);
    }
    return !!filter;
  }

}

/**
 * create Exceptionhandler class for callbackProxy exception handle;
 */
module.exports = ExceptionHanlder;

