'use strict';
const { RouteParamTypes } = require('../constants');

class RouterParamFactory {

  /**
   * get ctx(context/request,response,body/param/queyr/headers/seesion)
   * @param {number} key:, type of RouterParamtypes
   * @param {string|number|object} data : ParamData ; such @Body('id)
   * @return {object} ctx property
   */
  extractValue(key, data) {
    return async function(ctx) {
      switch (key) {
        case RouteParamTypes.CONTEXT:
          return ctx;
        case RouteParamTypes.REQUEST:
          return ctx.request;
        case RouteParamTypes.RESPONSE:
          return ctx.response;
        case RouteParamTypes.BODY:
          return data && ctx.request.body ? ctx.request.body[data] : ctx.request.body;
        case RouteParamTypes.PARAM:
          return data ? ctx.params[data] : ctx.params;
        case RouteParamTypes.QUERY:
          return data ? ctx.query[data] : ctx.query;
        case RouteParamTypes.HEADERS:
          return data ? ctx.headers[data] : ctx.headers;
        case RouteParamTypes.SESSION:
          return ctx.session;
        case RouteParamTypes.FILE:
          return ctx.request.files[0];
        case RouteParamTypes.FILES:
          return ctx.request.files;
        case RouteParamTypes.FILESTREAM:
          return ctx.getFileStream && await ctx.getFileStream(data);
        case RouteParamTypes.FILESSTREAM:
          return ctx.multipart && ctx.multipart(data);
        default:
          return null;
      }
    };
  }

}

module.exports = RouterParamFactory;
