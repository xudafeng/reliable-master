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

const user = require('./api/user');

function *getContext() {
  let context = {};
  let page = {};
  page.name = 'signup';
  context.csrf = this.csrf;
  context.page = page;
  return context;
}

function *dispatch() {
  const context = yield getContext.call(this);
  this.body = this.render('signup', context);
}

module.exports = dispatch;
