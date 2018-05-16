'use strict';
exports.RouteParamTypes = {
  QUERY: '0',
  0: 'QUERY',
  BODY: '1',
  1: 'BODY',
  PARAM: '2',
  2: 'PARAM',
  CONTEXT: '3',
  3: 'CONTEXT',
  REQUEST: '4',
  4: 'REQUEST',
  RESPONSE: '5',
  5: 'RESPONSE',
  HEADERS: '6',
  6: 'HEADERS',
  SESSION: '7',
  7: 'SESSION',
  FILE: '8',
  8: 'FILE',
  FILES: '9',
  9: 'FILES',
  CUSTOM: '10',
  10: 'CUSTOM',
};


exports.RequestMethod = {
  GET: '0',
  0: 'get',
  POST: '1',
  1: 'post',
  PUT: '2',
  2: 'put',
  DELETE: '3',
  3: 'delete',
  PATCH: '4',
  4: 'patch',
  ALL: '5',
  5: 'all',
  OPTIONS: '6',
  6: 'options',
  HEAD: '7',
  7: 'head',
  REDIRECT: '8',
  8: 'redirect',
};

// egg router
exports.REST_MAP = {
  index: {
    suffix: '',
    method: 'GET',
  },
  new: {
    namePrefix: 'new_',
    member: true,
    suffix: 'new',
    method: 'GET',
  },
  create: {
    suffix: '',
    method: 'POST',
  },
  show: {
    member: true,
    suffix: ':id',
    method: 'GET',
  },
  edit: {
    member: true,
    namePrefix: 'edit_',
    suffix: ':id/edit',
    method: 'GET',
  },
  update: {
    member: true,
    namePrefix: '',
    suffix: ':id',
    method: [ 'PATCH', 'PUT' ],
  },
  destroy: {
    member: true,
    namePrefix: 'destroy_',
    suffix: ':id',
    method: 'DELETE',
  },
};

exports.ImplementMethods = {
  canActivate: 'canActivate',
  transform: 'transform',
  intercept: 'intercept',
  catch: 'catch',
};

exports.PATH_METADATA = 'path_metadata';
exports.METHOD_METADATA = 'method_metadata';
exports.ROUTE_NAME_METADATA = 'route_name_metadata';

exports.GUARDS_METADATA = 'guards_metadata';
exports.PIPES_METADATA = 'pipes_metadata';
exports.INTERCEPTORS_METADATA = 'interceptor-metadata';
exports.EXCEPTION_FILTERS_METADATA = '__exceptionFilters__';
exports.FILTER_CATCH_EXCEPTIONS = '__filterCatchExceptions__';

exports.ROUTE_ARGS_METADATA = 'route-args-metadata';
exports.PARAMTYPES_METADATA = 'design:paramtypes';
exports.SELF_DECLARED_DEPS_METADATA = 'self:paramtypes';
exports.RENDER_METADATA = 'render_metadata';
exports.HEADER_METADATA = 'header_metadata';
