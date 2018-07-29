'use strict';
const is = require('is-type-of');
const { HttpException } = require('../exceptions/exception');


class ExceptionHanlder {

  next(exception, app) {
    const { ctx } = app;
    if (this.invokeCustomFilters(exception, app)) return;
    // common throw error
    if (!(exception instanceof HttpException)) {
      throw exception;
    }
    // custom exception which extends HttpException
    const res = exception.getResponse();
    const message = is.object(res)
      ? res
      : {
        statusCode: exception.getStatus(),
        message: res,
      };

    app.ctx.status = exception.getStatus();
    if (is.nullOrUndefined(message)) {
      ctx.body = '';
      return;
    }
    ctx.body = is.object(message) ? message : String(message);
    return;
  }

  setCustomFilters(filters = []) {
    this.filters = filters;
    return this;
  }

  invokeCustomFilters(exception, app) {
    if (!this.filters.length) return false;
    const filter = this.filters.find(filter => {
      const exceptionMetatypes = filter.exceptionMetatypes;
      const hasMetatype =
        !exceptionMetatypes.length ||
        !!exceptionMetatypes.find(
          ExceptionMetatype => exception instanceof ExceptionMetatype
        );
      return hasMetatype;
    });
    filter && filter.catch.call(app, exception);
    return !!filter;
  }

}

/**
 * create Exceptionhandler class for callbackProxy exception handle;
 */
module.exports = {

  createExceptionHandler() {

    return new ExceptionHanlder();

  },
};

