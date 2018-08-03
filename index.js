'use strict';
const common = require('./lib/common');
const decorator = require('./lib/decorator');
const HttpStatus = require('./lib/exceptions/constant');
const HttpException = require('./lib/exceptions/exception');
const MiddlewareConsumer = require('./lib/middleware');

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

