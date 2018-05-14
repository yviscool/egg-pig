'use strict';
const decorator = require('./lib/decorator');
const MiddlewareConsumer = require('./lib/middleware');

module.exports = {
  ...decorator,
  MiddlewareConsumer,
  CanActivate: class { },
  PipeTransform: class { },
  EgggInterceptor: class { },
};

