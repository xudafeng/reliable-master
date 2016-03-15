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

const os = require('os');

const pkg = require('../../package');

module.exports = function() {
  const string = `${pkg.name}/${pkg.version} node/${process.version}(${os.platform()})`;

  return function *powerby(next) {
    yield next;
    this.set('X-Powered-By', string);
  };
};
