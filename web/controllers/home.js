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

function *getContext() {
  let context = {};
  context.session = this.session;
  let page = {};
  context.csrf = this.csrf;
  page.name = 'home';
  context.page = page;
  return context;
}

function *dispatch() {
  const context = yield getContext.call(this);
  this.body = this.render('home', context);
}

module.exports = dispatch;
