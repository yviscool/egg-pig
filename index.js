'use strict';
const common = require('./lib/common');
const decorator = require('./lib/decorator');
const MiddlewareConsumer = require('./lib/middleware');
const HttpStatus = require('./lib/exceptions/constant');
const HttpException = require('./lib/exceptions/exception');

module.exports = {
  ...common,
  ...decorator,
  ...HttpStatus,
  ...HttpException,
  MiddlewareConsumer,
  CanActivate: class { },
  PipeTransform: class { },
  EggInterceptor: class { },
  ExceptionFilter: class { },
};

