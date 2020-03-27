'use strict';
const is = require('is-type-of');
const utils = module.exports = { };

const MissingRequiredDependency = (name, reason) =>
  `The "${name}" package is missing. Please, make sure to install this library ($ npm install ${name} / or require)  to take advantage of ${reason}.`;


utils.loadPackage = function loadPackage(packageName, context) {
  try {
    return require(packageName);
  } catch (e) {
    console.error();
    throw new Error(MissingRequiredDependency(packageName, context));
  }
};

utils.safeRequire = function require(packageName) {
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
  if (is.nullOrUndefined(obj)) {
    return undefined;
  }
  let willReturn = obj;
  let counter = 0;

  const pathArrValue = is.string(pathArr) ? pathArr.split('.') : pathArr;

  while (counter < pathArrValue.length) {
    if (is.nullOrUndefined(willReturn)) {
      return undefined;
    }
    willReturn = willReturn[pathArrValue[counter]];
    counter++;
  }

  return willReturn;
};

