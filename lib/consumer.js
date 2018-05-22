'use strict';

const Consumer = {
  modules: new Map(),
  injectables: new Map(),
};

const loaders = [
  require('./mixin/scanner'),
  require('./mixin/router_execution_context'),
  require('./mixin/module_creator'),
  require('./mixin/utils'),
  require('./mixin/context_creator'),
  require('./mixin/instance_loader'),
  require('./mixin/router_param_factory'),
  require('./mixin/exception_handler'),
  require('./mixin/router_proxy'),
  require('./mixin/router_resolver'),
  require('./mixin/pevent'),
];

for (const loader of loaders) {
  Object.assign(Consumer, loader);
}


module.exports = Consumer;
