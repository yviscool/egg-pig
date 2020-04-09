'use strict';

const utils = module.exports = { };

const MissingRequiredDependency = (name, reason) =>
  `The "${name}" package is missing. Please, make sure to install this library ($ npm install ${name} / or require)  to take advantage of ${reason}.`;


utils.loadPackage = function loadPackage(packageName, context) {
  try {
    return require(packageName);
  } catch (e) {
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
