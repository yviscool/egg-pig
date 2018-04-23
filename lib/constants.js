exports.RouteParamTypes = {
    'QUERY': '0',
    '0': 'QUERY',
    'BODY': '1',
    '1': 'BODY',
    'PARAM': '2',
    '2': 'PARAM',
    'CONTEXT': '3',
    '3': 'CONTEXT',
    'REQUEST': '4',
    '4': 'REQUEST',
    'RESPONSE': '5',
    '5': 'RESPONSE',
    'HEADERS': '6',
    '6': 'HEADERS',
    'SESSION': '7',
    '7': 'SESSION',
}


exports.RequestMethod = {
    'GET': '0',
    '0': 'get',
    'POST': '1',
    '1': 'post',
    'PUT': '2',
    '2': 'put',
    'DELETE': '3',
    '3': 'delete',
    'PATCH': '4',
    '4': 'patch',
    'ALL': '5',
    '5': 'all',
    'OPTIONS': '6',
    '6': 'options',
    'HEAD': '7',
    '7': 'head',
    'REDIRECT': '8',
    '8': 'redirect',
}




exports.ImplementMethods = {
    'canActivate': 'canActivate',
    'transform': 'transform',
    'intercept': 'intercept',
}

exports.PATH_METADATA = 'path_metadata';
exports.METHOD_METADATA = 'method_metadata';
exports.ROUTE_NAME_METADATA = 'method_metadata';

exports.GUARDS_METADATA = 'guards_metadata';
exports.PIPES_METADATA = 'pipes_metadata';
exports.INTERCEPTORS_METADATA = 'interceptor-metadata';

exports.ROUTE_ARGS_METADATA = 'route-args-metadata';
exports.PARAMTYPES_METADATA = 'design:paramtypes';
exports.SELF_DECLARED_DEPS_METADATA = 'self:paramtypes';