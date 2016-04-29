'use strict';

const User = require('../../common/models').User;

function *getRetakeContext() {
  let context = {};
  let page = {};
  page.name = 'password';
  page.catelog = 'retake';
  context.csrf = this.csrf;
  context.page = page;
  return context;
}

function *getResetContext() {
  let context = {};
  let page = {};
  page.name = 'password';
  page.catelog = 'reset';
  let user = yield User.findOne({
    resetPasswordToken: this.query.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  });
  if (user) {
    context.user = user;
  }
  context.csrf = this.csrf;
  context.page = page;
  return context;
}

function *dispatch() {
  if (!!~this.path.indexOf('retake')) {
    this.body = this.render('password', yield getRetakeContext.call(this));
  } else if (!!~this.path.indexOf('reset')) {
    this.body = this.render('password', yield getResetContext.call(this));
  }
}

module.exports = dispatch;
