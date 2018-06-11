'use strict';

const Consumer = {
  _config: [],
  _routers: new Map(),

  setRouters(routers) {
    routers.forEach(({ controller, fullpath }) => {
      this._routers.set(fullpath, {
        fullpath,
        routerPaths: [],
        routerMetadata: null,
        name: controller.name,
        metatype: controller,
      });
    });
  },

  getRouters() {
    return this._routers;
  },

  setConfig(config) {
    this._config = config;
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
