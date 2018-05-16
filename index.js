'use strict';
const decorator = require('./lib/decorator');
const MiddlewareConsumer = require('./lib/middleware');
const HttpException = require('./lib/exceptions/exception');
const HttpStatus = require('./lib/exceptions/constant');

module.exports = {
  ...decorator,
  ...HttpException,
  ...HttpStatus,
  MiddlewareConsumer,
  CanActivate: class { },
  PipeTransform: class { },
  EgggInterceptor: class { },
  ExceptionFilter: class { },
};

