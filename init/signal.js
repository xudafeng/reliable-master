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

const killing = require('killing');

module.exports = function(signal) {
  switch (signal) {
    case 'stop':
      killing('reliable-master');
      break;
    case 'restart':
      // TODO
      break;
    default:
      console.log('\n  arguments `\u001b[33m%s\u001b[0m` not found', signal || 'undefined');
      break;
  }
};
