'use strict';
const common = require('./lib/common');
const constant = require('./lib/constants');
const decorator = require('./lib/decorator');
const HttpStatus = require('./lib/exceptions/constant');
const HttpException = require('./lib/exceptions/exception');

module.exports = {
  ...common,
  ...constant,
  ...decorator,
  ...HttpStatus,
  ...HttpException,
  CanActivate: class { },
  PipeTransform: class { },
  EggInterceptor: class { },
  ExceptionFilter: class { },
};

