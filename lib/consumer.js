'use strict';

const Consumer = {
  modules: new Map(),
  injectables: new Map(),
};

const loaders = [
  require('./mixin/router_execution_context'),
  require('./mixin/module_creator'),
  require('./mixin/context_creator'),
  require('./mixin/instance_loader'),
  require('./mixin/router_param_factory'),
  require('./mixin/exception_handler'),
  require('./mixin/router_proxy'),
];

for (const loader of loaders) {
  Object.assign(Consumer, loader);
}


module.exports = Consumer;
