'use strict';

require('reflect-metadata');
const is = require('is-type-of');
const { loadPackage } = require('../utils');
const { map } = require('rxjs/operators');

const CLASS_SERIALIZER_OPTIONS = 'class_serializer:options';

let classTransformer = {};

module.exports = class ClassSerializerInterceptor {

  constructor() {
    const loadPkg = pkg => loadPackage(pkg, 'ClassSerializerInterceptor');
    classTransformer = loadPkg('class-transformer');
  }

  intercept(context, call$) {
    const options = this.getContextOptions(context);
    return call$.pipe(
      map(res => this.serialize(res, options))
    );
  }

  serialize(response, options) {
    const isArray = Array.isArray(response);
    if (!is.object(response) && !isArray) {
      return response;
    }
    return isArray
      ? response.map(item => this.transformPlain(item, options))
      : this.transformPlain(response, options);
  }

  transformPlain(plainOrClass, options) {
    return plainOrClass && plainOrClass.constructor !== Object
      ? classTransformer.classToPlain(plainOrClass, options)
      : plainOrClass;
  }

  getContextOptions(context) {
    return (
      Reflect.getMetadata(CLASS_SERIALIZER_OPTIONS, context.getHandler()) ||
        Reflect.getMetadata(CLASS_SERIALIZER_OPTIONS, context.getClass())
    );
  }

};

