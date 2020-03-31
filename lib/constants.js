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
  FILESTREAM: '10',
  10: 'FILESTREAM',
  FILESSTREAM: '11',
  11: 'FILESSTREAM',
  CUSTOM: '10',
  12: 'CUSTOM',
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


exports.PATH_METADATA = '__pathMetadata__';
exports.METHOD_METADATA = '__methodMetadata__';
exports.PRIORITY_METADATA = '__priorityMetadata__';
// exports.ROUTE_NAME_METADATA = '__routeNameMetadata__';
exports.ROUTE_OPTIONS_METADATA = '__routeOptionMetadata__';
exports.CONTROLLER_MODULE_METADATA = '__controllerModuleMetadata__';

exports.GUARDS_METADATA = '__guardsMetadata__';
exports.PIPES_METADATA = '__pipesMetadata__';
exports.INTERCEPTORS_METADATA = '__interceptorMetadata__';
exports.EXCEPTION_FILTERS_METADATA = '__exceptionFilters__';
exports.FILTER_CATCH_EXCEPTIONS = '__filterCatchExceptions__';

exports.ROUTE_ARGS_METADATA = '__routeArgsMetadata__';
exports.RENDER_METADATA = '__renderMetadata__';
exports.HEADER_METADATA = '__headerMetadata__';
exports.HTTP_CODE_METADATA = '__httpCode__';
exports.PARAMTYPES_METADATA = 'design:paramtypes';
exports.SELF_DECLARED_DEPS_METADATA = 'self:paramtypes';
