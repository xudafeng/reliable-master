'use strict';

const debug = require('debug')('reliable:middleware:openApiAuthorize');

module.exports = () => {
  return async function openApiAuthorize(ctx, next) {
    const origin = ctx.get('origin');
    const path = ctx.path;
    debug('path %s origin %s', path, origin);
    ctx.logger.info('[reliable-middleware-openApiAuthorize] path %s origin %s', path, origin);
    if (!origin) {
      await next();
      return;
    }
    await next();
    return;
  };
};
