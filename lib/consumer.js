'use strict';

const Consumer = {
  config: [],
  routers: [],
  modules: new Map(),
  injectables: new Map(),
  setRouters(routers) {
    this.routers = routers;
  },

  setConfig(config) {
    this.config = config;
  },
  getModules() {
    return this.modules;
  },
};

const loaders = [
  require('./mixin/router_execution_context'),
  require('./mixin/module_creator'),
  require('./mixin/context_creator'),
  require('./mixin/router_param_factory'),
  require('./mixin/exception_handler'),
  require('./mixin/router_proxy'),
];

for (const loader of loaders) {
  Object.assign(Consumer, loader);
}


module.exports = Consumer;
