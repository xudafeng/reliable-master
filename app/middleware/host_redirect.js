'use strict';

const debug = require('debug')('reliable:middleware:hostRedirect');

module.exports = options => {
  return async function hostRedirect(ctx, next) {
    const defaultHost = options.defaultHost;
    debug(defaultHost);
    if (!defaultHost) {
      await next();
      return;
    }
    if (ctx.host !== defaultHost) {
      ctx.logger.info('[reliable-middleware-hostRedirect] protocol %s host %s defaultHost %s',
        ctx.protocol, ctx.host, defaultHost);
      // use http by default, more flexiable with options
      // ctx.redirect(`${ctx.protocol}://${defaultHost}`);
      ctx.redirect(`http://${defaultHost}`);
      return;
    }
    await next();
  };
};
