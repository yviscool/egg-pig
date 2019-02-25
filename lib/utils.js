'use strict';
const co = require('co');
const is = require('is-type-of');

const utils = module.exports = { };

const MissingRequiredDependency = (name, reason) =>
  `The "${name}" package is missing. Please, make sure to install this library ($ npm install ${name} / or require)  to take advantage of ${reason}.`;


utils.convertGeneratorFunction = function convertGeneratorFunction(fn) {
  return is.generatorFunction(fn) ? co.wrap(fn) : fn;
};

utils.loadPackage = function loadPackage(packageName, context) {
  try {
    return require(packageName);
  } catch (e) {
    console.error(MissingRequiredDependency(packageName, context));
    process.exit(1);
  }
};

utils.require = function require(packageName) {
  try {
    return require(packageName);
  } catch (e) {
    return undefined;
  }
};

// get object properties
// path(['a', 'b'], { a: { b: 1 } }) => 1
utils.path = function path(pathArr, obj) {
  if (arguments.length === 1) {
    return function(objHolder) {
      return path(pathArr, objHolder);
    };
  }
  if (obj === null || obj === undefined) {
    return undefined;
  }
  let willReturn = obj;
  let counter = 0;

  const pathArrValue = typeof pathArr === 'string' ? pathArr.split('.') : pathArr;

  while (counter < pathArrValue.length) {
    if (willReturn === null || willReturn === undefined) {
      return undefined;
    }
    willReturn = willReturn[pathArrValue[counter]];
    counter++;
  }

  return willReturn;
};

