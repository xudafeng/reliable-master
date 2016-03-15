/* ================================================================
 * reliable-master by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

const request = require('co-request');

module.exports = function *(options) {
  try {
    return yield request(options);
  } catch (err) {
    console.warn('Get remote update info failed.');

    if (err.code === 'ETIMEDOUT') {
      return null;
    }
  }
};
