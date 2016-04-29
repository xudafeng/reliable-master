

'use strict';

const user = require('./api/user');

function *getContext() {
  let context = {};
  let page = {};
  page.name = 'login';
  context.csrf = this.csrf;
  context.page = page;
  return context;
}

function *dispatch() {
  const context = yield getContext.call(this);
  this.body = this.render('login', context);
}

module.exports = dispatch;
