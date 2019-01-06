'use strict';

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (e) {

      ctx.logger.error(e);

      let message = e.status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : e.message;

      if (e.code === 'invalid_param') {
        message += `, ${e.errors.map(e => `${e.field}: ${e.message}`).join(', ')}`;
        ctx.fail('ERR_RELIABLE_INVALID_PARAM_ERROR', message);
        return;
      }

      ctx.fail('ERR_RELIABLE_INTERNAL_SERVER_ERROR', message);
    }
  };
};
