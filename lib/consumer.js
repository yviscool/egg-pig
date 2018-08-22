'use strict';

const Consumer = {
  _config: null,
  _routers: null,

  setConfig(config) {
    this._config = config;
    return this;
  },

  setRouters(routers) {
    this._routers = routers;
    return this;
  },

  getRouters() {
    return this._routers;
  },

};

const loaders = [
  require('./mixin/router_execution_context'),
  require('./mixin/context_creator'),
  require('./mixin/router_param_factory'),
  require('./mixin/exception_handler'),
  require('./mixin/router_proxy'),
];

for (const loader of loaders) {
  Object.assign(Consumer, loader);
}


module.exports = Consumer;
