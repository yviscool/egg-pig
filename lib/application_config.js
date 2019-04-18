'use strict';
const is = require('is-type-of');
const assert = require('assert');
const utils = require('./utils');

const EggRouter = utils.require('egg-core/lib/utils/router') || require('@eggjs/router').EggRouter;

const ConfigValidator = {

  validate(config) {
    return {
      globalPipes: this.validPipes(config.globalPipes),
      globalGuards: this.validGuards(config.globalGuards),
      globalFilters: this.validFilters(config.globalFilters),
      globalInterceptors: this.validInterceptors(config.globalInterceptors),
    };
  },

  validPipes(pipes = []) {
    assert(Array.isArray(pipes), 'global pipes should be array');
    return pipes.filter(pipe => pipe && (is.function(pipe) || is.function(pipe.transform)));
  },

  validGuards(guards = []) {
    assert(Array.isArray(guards), 'global guards should be array');
    return guards.filter(guard => guard && (is.function(guard) || is.function(guard.canActivate)));
  },

  validFilters(filters = []) {
    assert(Array.isArray(filters), 'global filters should be array');
    return filters.filter(filter => filter && (is.function(filter) || is.function(filter.catch)));
  },

  validInterceptors(interceptors = []) {
    assert(Array.isArray(interceptors), 'global interceptors should be array');
    return interceptors.filter(interceptor => interceptor && (is.function(interceptor) || is.function(interceptor.intercept)));
  },

};


class ApplicationConfig {

  /**
     *
     * @param {*} app  egg app instance
     */
  constructor(app) {

    this.globalPipes = [];
    this.globalGuards = [];
    this.globalFilters = [];
    this.globalInterceptors = [];

    this.container = new Map();

    this.app = app;
    this.baseDir = app.baseDir;
    this.controller = app.controller = {};
    this.globalPrefix = app.config.globalPrefix || '';
    this.loadController = app.config.eggpig.loadController;

    // mix globalGuards/filters/Pipes/interceptors
    Object.assign(this, ConfigValidator.validate(app.config));

  }

  getEggBaseDir() {
    return this.baseDir;
  }

  getEggAppController() {
    return this.controller;
  }

  getGlobalPrefix() {
    let path = this.globalPrefix;
    const validatePath = path => (path.charAt(0) !== '/' ? '/' + path : path);
    path = path ? validatePath(path) : path;
    path = path ? path.replace(/\/$/, '') : path;
    this.globalPrefix = path;
    return path;
  }

  getGlobalPipes() {
    return this.globalPipes;
  }

  getGlobalFilters() {
    return this.globalFilters;

  }
  getGlobalGuards() {
    return this.globalGuards;
  }

  getGlobalInterceptors() {
    return this.globalInterceptors;
  }

  /**
   * @param {string} basePath is @Controller(path) path
   * @return {EggRouter} EggRouter
   */
  createEggRouter(basePath) {
    if (basePath) {
      return new EggRouter({ sensitive: true, prefix: this.getGlobalPrefix() + basePath }, this.app);
    }
    return new EggRouter({ sensitive: true }, this.app);
  }
}

module.exports = ApplicationConfig;

