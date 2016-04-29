

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
