

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
