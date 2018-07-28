'use strict';
const { BadRequestException } = require('../exceptions/exceptions');
const is = require('is-type-of');

let classValidator = {};
let classTransformer = {};

const MissingRequiredDependency = (name, reason) =>
  `The "${name}" package is missing. Please, make sure to install this library ($ npm install ${name}) to take advantage of ${reason}.`;

function loadPackage(packageName, context) {
  try {
    return require(packageName);
  } catch (e) {
    console.error(MissingRequiredDependency(packageName, context));
    process.exit(1);
  }
}

module.exports = class ValidationPipe {

  constructor(options) {
    options = options || {};
    const { transform, disableErrorMessages, ...validatorOptions } = options;
    this.isTransformEnabled = !!transform;
    this.validatorOptions = validatorOptions;
    this.isDetailedOutputDisabled = disableErrorMessages;
    const loadPkg = pkg => loadPackage(pkg, 'ValidationPipe');
    classValidator = loadPkg('class-validator');
    classTransformer = loadPkg('class-transformer');
  }

  async transform(value, metadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metadata)) {
      return value;
    }
    const entity = classTransformer.plainToClass(
      metatype,
      this.toEmptyIfNil(value)
    );
    const errors = await classValidator.validate(entity, this.validatorOptions);
    if (errors.length > 0) {
      throw new BadRequestException(
        this.isDetailedOutputDisabled ? undefined : errors
      );
    }
    return this.isTransformEnabled
      ? entity
      : Object.keys(this.validatorOptions).length > 0
        ? classTransformer.classToPlain(entity)
        : value;
  }

  toValidate(metadata) {
    const { metatype, type } = metadata;
    if (type.toLowerCase() === 'custom') {
      return false;
    }
    const types = [ String, Boolean, Number, Array, Object ];
    return !types.find(t => metatype === t) && !is.null(metatype);
  }

  toEmptyIfNil(value) {
    return is.null(value) ? {} : value;
  }
};
