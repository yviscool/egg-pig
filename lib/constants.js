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


exports.ImplementMethods = {
    'canActivate': 'canActivate',
    'transform': 'transform',
    'intercept': 'intercept',
}

exports.GUARDS_METADATA = 'guards_metadata';
exports.PIPES_METADATA = 'pipes_metadata';
exports.INTERCEPTORS_METADATA = 'interceptor-metadata';
exports.ROUTE_ARGS_METADATA = 'route-args-metadata';
exports.PARAMTYPES_METADATA = 'design:paramtypes';
exports.SELF_DECLARED_DEPS_METADATA = 'self:paramtypes';