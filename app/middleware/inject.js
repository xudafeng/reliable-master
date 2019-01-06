'use strict';

const moment = require('moment');
const crypto = require('crypto');
const get = require('lodash.get');
const errors = require('../common/error');
const defaultErrorCode = 'ERR_RELIABLE_INTERNAL_SERVER_ERROR';

module.exports = () => {
  return async function inject(ctx, next) {
    ctx.moment = moment;
    ctx.safeGet = get;
    ctx.toMd5 = string => {
      return crypto.createHash('md5')
        .update(string, 'utf8')
        .digest('hex');
    };
    ctx.success = (data = {}) => {
      ctx.body = {
        success: true,
        data,
      };
    };

    ctx.fail = (errorCode = defaultErrorCode, message = '') => {
      if (!errors.has(errorCode)) {
        errorCode = defaultErrorCode;
      }
      const defaultMessage = errors.get(errorCode).message;
      ctx.body = {
        success: false,
        errorCode,
        message: message || defaultMessage,
      };
    };
    await next();
  };
};
