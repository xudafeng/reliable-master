'use strict';

const debug = require('debug')('reliable:middleware:authorize');

module.exports = () => {
  return async function authorize(ctx, next) {
    const host = ctx.host;
    if (host.startsWith('127.0.0.1')) {
      await next();
      return;
    }
    const user = ctx.session.user;
    const path = ctx.path;
    debug('path %s user %o', path, user);
    const authUrl = '/snsAuthorize/auth';
    if (!user) {
      if (ctx.acceptJSON) {
        ctx.status = 401;
        ctx.body = {
          url: authUrl,
        };
        return;
      }
      ctx.redirect(authUrl);
      return;
    }
    await next();
  };
};
